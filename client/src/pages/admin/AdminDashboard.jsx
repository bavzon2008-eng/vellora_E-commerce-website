import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../../services/api.js';
import AdminLayout from '../../components/AdminLayout.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { StatusPill } from '../../components/OrderCard.jsx';
import { money, dateFmt } from '../../utils/format.js';

export default function AdminDashboard() {
  const [s, setS] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/orders/stats/summary').then((r) => setS(r.data)).catch((e) => setError(errorMessage(e)));
  }, []);

  const cards = s && [
    ['Total products', s.totalProducts],
    ['Customers', s.totalUsers],
    ['Total orders', s.totalOrders],
    ['Revenue', money(s.totalRevenue)],
    ['Pending orders', s.pendingOrders],
    ['Delivered orders', s.deliveredOrders],
  ];

  return (
    <AdminLayout title="Dashboard">
      {error && <div className="notice notice-error">{error}</div>}
      {!s && !error && <LoadingSpinner label="Loading statistics…" />}
      {s && (
        <>
          <div className="stat-grid">
            {cards.map(([label, value]) => (<div key={label} className="card stat"><p className="muted small">{label}</p><strong>{value}</strong></div>))}
          </div>
          <div className="two-col">
            <section className="card pad">
              <h3>Recent orders</h3>
              {s.recentOrders.length === 0 && <p className="muted">No orders yet.</p>}
              {s.recentOrders.map((o) => (
                <div key={o.id} className="row-line">
                  <span><span className="mono">#{o.id.slice(-8).toUpperCase()}</span> · {o.user?.name || 'Customer'} · {dateFmt(o.createdAt)}</span>
                  <span>{money(o.total)} <StatusPill status={o.orderStatus} /></span>
                </div>
              ))}
              <Link to="/admin/orders" className="link-btn">Manage orders</Link>
            </section>
            <section className="card pad">
              <h3>Low stock</h3>
              {s.lowStock.length === 0 && <p className="muted">Everything is well stocked.</p>}
              {s.lowStock.map((p) => (
                <div key={p.id} className="row-line">
                  <span>{p.name} <span className="muted small">{p.brand}</span></span>
                  <Link to={`/admin/products/edit/${p.id}`} className={p.stock === 0 ? 'stock-out' : 'stock-low'}>{p.stock} left</Link>
                </div>
              ))}
            </section>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
