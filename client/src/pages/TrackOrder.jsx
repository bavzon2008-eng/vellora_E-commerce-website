import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import OrderTimeline from '../components/OrderTimeline.jsx';
import { StatusPill } from '../components/OrderCard.jsx';
import { OrderError, useOrder } from './OrderDetails.jsx';
import { dateFmt, money } from '../utils/format.js';

export default function TrackOrder() {
  const { id } = useParams();
  const { order: first, loading, error } = useOrder(id);
  const [order, setOrder] = useState(null);

  useEffect(() => setOrder(first), [first]);

  // Refresh every 20s so admin status changes show up without reloading
  useEffect(() => {
    const t = setInterval(() => api.get(`/orders/${id}`).then((r) => setOrder(r.data.order)).catch(() => {}), 20000);
    return () => clearInterval(t);
  }, [id]);

  if (loading || (!order && !error)) return <LoadingSpinner fullPage label="Loading tracking…" />;
  if (error) return <OrderError error={error} />;

  return (
    <div className="container page narrow">
      <p className="crumbs small"><Link to="/orders">My orders</Link> / <Link to={`/orders/${order.id}`}>Order details</Link></p>
      <h1>Track order</h1>
      <div className="card pad">
        <div className="order-head">
          <div><p className="muted small">Order ID</p><strong className="mono">#{order.id.slice(-8).toUpperCase()}</strong></div>
          <div><p className="muted small">Placed</p><strong>{dateFmt(order.createdAt)}</strong></div>
          <div><p className="muted small">Total</p><strong>{money(order.total)}</strong></div>
          <div><p className="muted small">Payment</p><strong>{order.paymentStatus}</strong></div>
          <StatusPill status={order.orderStatus} />
        </div>
        <OrderTimeline order={order} />
        <h4>Items</h4>
        <ul className="plain">
          {order.items.map((i, idx) => (<li key={idx} className="small">{i.name}{i.shade ? ` (${i.shade})` : ''} × {i.quantity}</li>))}
        </ul>
      </div>
    </div>
  );
}
