const mongoose = require('mongoose');
const Product = require('../models/Product');
const { CATEGORY_GROUPS } = require('../utils/categories');
const { httpError, asyncHandler } = require('../utils/httpError');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORTS = {
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  rating: { rating: -1, reviewCount: -1 },
  newest: { createdAt: -1 },
  'name-asc': { name: 1 },
};

exports.getProducts = asyncHandler(async (req, res) => {
  const { search, category, brand, minPrice, maxPrice, rating, sort = 'newest' } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 60);

  const filter = {};
  const and = [];

  if (search && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), 'i');
    and.push({ $or: [{ name: rx }, { brand: rx }, { category: rx }, { group: rx }] });
  }
  if (category) {
    // accepts a group (Lips) or a sub-category (Lipstick); comma-separated allowed
    const list = String(category).split(',').map((c) => c.trim()).filter(Boolean);
    and.push({ $or: [{ category: { $in: list } }, { group: { $in: list } }] });
  }
  if (brand) filter.brand = { $in: String(brand).split(',').map((b) => b.trim()).filter(Boolean) };

  const min = Number(minPrice);
  const max = Number(maxPrice);
  if ((minPrice !== undefined && minPrice !== '' && !Number.isNaN(min)) || (maxPrice !== undefined && maxPrice !== '' && !Number.isNaN(max))) {
    filter.price = {};
    if (minPrice !== undefined && minPrice !== '' && !Number.isNaN(min)) filter.price.$gte = min;
    if (maxPrice !== undefined && maxPrice !== '' && !Number.isNaN(max)) filter.price.$lte = max;
  }
  if (rating && !Number.isNaN(Number(rating))) filter.rating = { $gte: Number(rating) };
  if (and.length) filter.$and = and;

  const [products, total] = await Promise.all([
    Product.find(filter).sort(SORTS[sort] || SORTS.newest).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({ products, page, limit, total, pages: Math.max(Math.ceil(total / limit), 1) });
});

// Brands + categories + price bounds used by the filter sidebar
exports.getMeta = asyncHandler(async (_req, res) => {
  const [brands, bounds] = await Promise.all([
    Product.distinct('brand'),
    Product.aggregate([{ $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } }]),
  ]);
  res.json({
    brands: brands.sort((a, b) => a.localeCompare(b)),
    groups: CATEGORY_GROUPS,
    minPrice: bounds[0]?.min || 0,
    maxPrice: bounds[0]?.max || 0,
  });
});

exports.getProduct = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw httpError(400, 'Invalid product ID');
  const product = await Product.findById(req.params.id);
  if (!product) throw httpError(404, 'Product not found');
  res.json({ product });
});

const FIELDS = ['name', 'brand', 'category', 'description', 'price', 'originalPrice', 'stock', 'rating', 'reviewCount', 'image', 'images', 'ingredients', 'benefits', 'howToUse', 'shades'];

function pickAndValidate(body, { partial = false } = {}) {
  const data = {};
  FIELDS.forEach((f) => {
    if (body[f] !== undefined) data[f] = body[f];
  });

  ['price', 'originalPrice', 'stock', 'rating', 'reviewCount'].forEach((f) => {
    if (data[f] === '' || data[f] === null) {
      if (f === 'originalPrice') { delete data[f]; return; }
      throw httpError(400, `${f} is required`);
    }
    if (data[f] !== undefined) {
      data[f] = Number(data[f]);
      if (Number.isNaN(data[f])) throw httpError(400, `${f} must be a number`);
      if (data[f] < 0) throw httpError(400, `${f} cannot be negative`);
    }
  });
  if (data.stock !== undefined && !Number.isInteger(data.stock)) throw httpError(400, 'Stock must be a whole number');
  if (data.rating !== undefined && data.rating > 5) throw httpError(400, 'Rating cannot be more than 5');
  if (data.name !== undefined && !String(data.name).trim()) throw httpError(400, 'Product name cannot be empty');
  if (data.brand !== undefined && !String(data.brand).trim()) throw httpError(400, 'Brand cannot be empty');
  if (data.description !== undefined && !String(data.description).trim()) throw httpError(400, 'Description cannot be empty');

  if (!partial) {
    ['name', 'brand', 'category', 'description', 'price', 'stock'].forEach((f) => {
      if (data[f] === undefined || data[f] === '') throw httpError(400, `${f} is required`);
    });
  }

  ['ingredients', 'benefits', 'images'].forEach((f) => {
    if (data[f] !== undefined && !Array.isArray(data[f])) throw httpError(400, `${f} must be a list`);
    if (Array.isArray(data[f])) data[f] = data[f].map((s) => String(s).trim()).filter(Boolean);
  });
  if (data.shades !== undefined) {
    if (!Array.isArray(data.shades)) throw httpError(400, 'shades must be a list');
    data.shades = data.shades
      .filter((s) => s && String(s.name || '').trim())
      .map((s) => ({ name: String(s.name).trim(), hex: /^#[0-9a-fA-F]{3,8}$/.test(s.hex || '') ? s.hex : '#cccccc' }));
  }
  return data;
}

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(pickAndValidate(req.body));
  res.status(201).json({ product });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw httpError(400, 'Invalid product ID');
  const product = await Product.findById(req.params.id);
  if (!product) throw httpError(404, 'Product not found');
  product.set(pickAndValidate(req.body, { partial: true }));
  await product.save(); // runs validators and the pre-validate hook
  res.json({ product });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw httpError(400, 'Invalid product ID');
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw httpError(404, 'Product not found');
  res.json({ message: 'Product deleted' });
});
