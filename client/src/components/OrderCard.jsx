import { Link } from 'react-router-dom';
import { dateFmt, money } from '../utils/format.js';

export const StatusPill = ({ status }) => <span className={`pill pill-${status.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>;

export default function OrderCard({ order }) {
  return (
    <div className="card order-card">
      <div className="order-head">
        <div>
          <p className="muted small">Order</p>
          <strong className="mono">#{order.id.slice(-8).toUpperCase()}</strong>
        </div>
        <div><p className="muted small">Placed</p><strong>{dateFmt(order.createdAt)}</strong></div>
        <div><p className="muted small">Total</p><strong>{money(order.total)}</strong></div>
        <StatusPill status={order.orderStatus} />
      </div>
      <p className="small muted">{order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}</p>
      <div className="card-actions">
        <Link to={`/orders/${order.id}`} className="btn btn-ghost btn-sm">View order</Link>
        <Link to={`/track-order/${order.id}`} className="btn btn-primary btn-sm">Track order</Link>
      </div>
    </div>
  );
}
