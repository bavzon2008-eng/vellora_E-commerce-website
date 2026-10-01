import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import api, { errorMessage } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ProductImage from '../components/ProductImage.jsx';
import { StatusPill } from '../components/OrderCard.jsx';
import { dateFmt, money } from '../utils/format.js';

export function useOrder(id) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    setLoading(true);
    api.get(`/orders/${id}`).then((r) => setOrder(r.data.order)).catch((e) => setError(errorMessage(e))).finally(() => setLoading(false));
  }, [id]);
  return { order, loading, error };
}

export const OrderError = ({ error }) => (
  <div className="container page empty"><h2>We couldn't open this order</h2><p className="muted">{error}</p><Link to="/orders" className="btn btn-primary">Back to my orders</Link></div>
);

export default function OrderDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const { order, loading, error } = useOrder(id);

  if (loading) return <LoadingSpinner fullPage label="Loading order…" />;
  if (error) return <OrderError error={error} />;

  const a = order.shippingAddress;
  return (
    <div className="container page">
      {state?.confirmed && (
        <div className="notice notice-success confirm">
          <h2>Thank you, your order is placed.</h2>
          <p>We sent the details to {order.customerInfo.email}. {order.paymentMethod === 'COD' ? 'Keep the amount ready for delivery.' : 'Your demo payment was recorded as paid.'}</p>
        </div>
      )}
      <div className="page-head">
        <h1>Order <span className="mono">#{order.id.slice(-8).toUpperCase()}</span></h1>
        <Link to={`/track-order/${order.id}`} className="btn btn-primary">Track order</Link>
      </div>
      <div className="cart-layout">
        <div className="card cart-list">
          {order.items.map((i, idx) => (
            <div key={idx} className="cart-item static">
              <div className="cart-thumb"><ProductImage src={i.image} alt={i.name} /></div>
              <div className="cart-main"><p className="muted small">{i.brand}</p><strong>{i.name}</strong>{i.shade && <p className="small">Shade: {i.shade}</p>}<p className="small muted">{money(i.price)} × {i.quantity}</p></div>
              <strong>{money(i.price * i.quantity)}</strong>
            </div>
          ))}
        </div>
        <aside className="card summary">
          <div className="sum-row"><span>Placed</span><span>{dateFmt(order.createdAt)}</span></div>
          <div className="sum-row"><span>Status</span><StatusPill status={order.orderStatus} /></div>
          <div className="sum-row"><span>Payment</span><span>{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Demo card'} · {order.paymentStatus}</span></div>
          <div className="sum-row"><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
          <div className="sum-row"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : money(order.shipping)}</span></div>
          <div className="sum-row total"><span>Total</span><span>{money(order.total)}</span></div>
          <h4>Ships to</h4>
          <p className="small">{order.customerInfo.fullName}<br />{a.address}<br />{a.city}, {a.state} {a.postalCode}<br />{a.country}<br />{order.customerInfo.phone}</p>
        </aside>
      </div>
    </div>
  );
}
