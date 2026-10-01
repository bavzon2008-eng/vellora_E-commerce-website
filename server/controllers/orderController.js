const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { ORDER_STATUSES } = require('../models/Order');
const { httpError, asyncHandler } = require('../utils/httpError');

const FREE_SHIPPING_ABOVE = 999;
const SHIPPING_FEE = 59;
const MAX_QTY_PER_LINE = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const text = (v) => String(v ?? '').trim();

function validateCheckoutBody({ customerInfo = {}, shippingAddress = {}, paymentMethod }) {
  const ci = { fullName: text(customerInfo.fullName), email: text(customerInfo.email), phone: text(customerInfo.phone) };
  const sa = {
    address: text(shippingAddress.address),
    city: text(shippingAddress.city),
    state: text(shippingAddress.state),
    postalCode: text(shippingAddress.postalCode),
    country: text(shippingAddress.country),
  };
  if (!ci.fullName) throw httpError(400, 'Full name is required');
  if (!EMAIL_RE.test(ci.email)) throw httpError(400, 'Enter a valid email address');
  if (!/^[0-9+\-\s]{7,15}$/.test(ci.phone)) throw httpError(400, 'Enter a valid phone number');
  Object.entries(sa).forEach(([k, v]) => {
    if (!v) throw httpError(400, `Shipping ${k} is required`);
  });
  if (!['COD', 'DEMO_CARD'].includes(paymentMethod)) throw httpError(400, 'Choose a valid payment method');
  return { ci, sa };
}

exports.createOrder = asyncHandler(async (req, res) => {
  const { items, paymentMethod } = req.body;
  const { ci, sa } = validateCheckoutBody(req.body);

  if (!Array.isArray(items) || items.length === 0) throw httpError(400, 'Your cart is empty');

  // Validate lines and merge duplicates of the same product + shade
  const lineMap = new Map();
  for (const it of items) {
    if (!mongoose.isValidObjectId(it.product)) throw httpError(400, 'Invalid product in cart');
    const qty = Number(it.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_LINE) {
      throw httpError(400, `Quantity must be between 1 and ${MAX_QTY_PER_LINE}`);
    }
    const key = `${it.product}|${it.shade || ''}`;
    const prev = lineMap.get(key);
    lineMap.set(key, { product: String(it.product), shade: text(it.shade), quantity: (prev?.quantity || 0) + qty });
  }
  const lines = [...lineMap.values()];

  // Total demand per product (for stock checks)
  const need = new Map();
  lines.forEach((l) => need.set(l.product, (need.get(l.product) || 0) + l.quantity));

  const products = await Product.find({ _id: { $in: [...need.keys()] } });
  const byId = new Map(products.map((p) => [String(p._id), p]));

  for (const [id, qty] of need) {
    const p = byId.get(id);
    if (!p) throw httpError(400, 'A product in your cart is no longer available. Please remove it and try again');
    if (p.stock <= 0) throw httpError(400, `${p.name} is out of stock`);
    if (qty > p.stock) throw httpError(400, `Only ${p.stock} of ${p.name} left in stock`);
  }
  for (const l of lines) {
    const p = byId.get(l.product);
    if (p.shades.length) {
      if (!l.shade || !p.shades.some((s) => s.name === l.shade)) throw httpError(400, `Select a valid shade for ${p.name}`);
    } else {
      l.shade = '';
    }
  }

  // Reserve stock atomically; undo everything if any line fails
  const reserved = [];
  const release = () => Promise.all(reserved.map(([id, q]) => Product.updateOne({ _id: id }, { $inc: { stock: q } })));
  try {
    for (const [id, qty] of need) {
      const r = await Product.updateOne({ _id: id, stock: { $gte: qty } }, { $inc: { stock: -qty } });
      if (r.modifiedCount !== 1) throw httpError(400, `${byId.get(id).name} just went out of stock`);
      reserved.push([id, qty]);
    }

    // Prices always come from the database, never from the client
    const orderItems = lines.map((l) => {
      const p = byId.get(l.product);
      return { product: p._id, name: p.name, brand: p.brand, image: p.image, price: p.price, quantity: l.quantity, shade: l.shade };
    });
    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;

    const order = await Order.create({
      user: req.user._id,
      customerInfo: ci,
      shippingAddress: sa,
      items: orderItems,
      subtotal,
      shipping,
      total: subtotal + shipping,
      paymentMethod,
      paymentStatus: paymentMethod === 'DEMO_CARD' ? 'Paid' : 'Pending',
      orderStatus: 'Pending',
      statusHistory: [{ status: 'Pending' }],
    });
    res.status(201).json({ order });
  } catch (err) {
    await release();
    throw err;
  }
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});

exports.getOrder = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw httpError(400, 'Invalid order ID');
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) throw httpError(404, 'Order not found');
  const ownerId = String(order.user._id || order.user);
  if (req.user.role !== 'admin' && ownerId !== String(req.user._id)) throw httpError(403, 'You cannot view this order');
  res.json({ order });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status && ORDER_STATUSES.includes(req.query.status)) filter.orderStatus = req.query.status;
  const orders = await Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ orders });
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw httpError(400, 'Invalid order ID');
  const { status } = req.body;
  if (!ORDER_STATUSES.includes(status)) throw httpError(400, `Status must be one of: ${ORDER_STATUSES.join(', ')}`);

  const order = await Order.findById(req.params.id);
  if (!order) throw httpError(404, 'Order not found');
  if (order.orderStatus === status) return res.json({ order });
  if (order.orderStatus === 'Cancelled') throw httpError(400, 'Cancelled orders cannot be reopened');

  if (status === 'Cancelled') {
    // put the stock back
    await Promise.all(order.items.map((i) => Product.updateOne({ _id: i.product }, { $inc: { stock: i.quantity } })));
  }
  order.orderStatus = status;
  if (status === 'Delivered') order.paymentStatus = 'Paid'; // COD is collected on delivery
  order.statusHistory.push({ status });
  await order.save();
  await order.populate('user', 'name email');
  res.json({ order });
});

exports.getStats = asyncHandler(async (_req, res) => {
  const [totalProducts, totalUsers, totalOrders, pendingOrders, deliveredOrders, revenueAgg, lowStock, recentOrders] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Order.countDocuments(),
    Order.countDocuments({ orderStatus: 'Pending' }),
    Order.countDocuments({ orderStatus: 'Delivered' }),
    Order.aggregate([{ $match: { orderStatus: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Product.find({ stock: { $lte: 5 } }).sort({ stock: 1 }).limit(6).select('name brand stock image'),
    Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name'),
  ]);
  res.json({
    totalProducts,
    totalUsers,
    totalOrders,
    totalRevenue: revenueAgg[0]?.total || 0,
    pendingOrders,
    deliveredOrders,
    lowStock,
    recentOrders,
  });
});
