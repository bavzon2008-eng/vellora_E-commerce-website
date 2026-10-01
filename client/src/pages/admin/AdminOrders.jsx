import { useEffect, useState } from 'react';
import api, { errorMessage } from '../../services/api.js';
import AdminLayout from '../../components/AdminLayout.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { StatusPill } from '../../components/OrderCard.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { dateFmt, money, ORDER_STATUSES } from '../../utils/format.js';

export default function AdminOrders() {
  const { notify } = useToast();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/orders', { params: { status: filter || undefined } })
      .then((r) => setOrders(r.data.orders))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, [filter]);

  const changeStatus = async (order, status) => {
    if (status === order.orderStatus) return;
    setSavingId(order.id);
    try {
      const r = await api.put(`/orders/${order.id}/status`, { status });
      setOrders((list) => list.map((o) => (o.id === order.id ? r.data.order : o)));
      notify(`Order marked ${status}`);
    } catch (e) {
      notify(errorMessage(e), 'error');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AdminLayout title="Orders">
      <select className="input" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ maxWidth: 240, marginBottom: 16 }} aria-label="Filter by status">
        <option value="">All statuses</option>
        {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
      </select>
      {error && <div className="notice notice-error">{error}</div>}
      {loading ? <LoadingSpinner label="Loading orders…" /> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Products</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
            <tbody>
              {orders.length === 0 && <tr><td colSpan="7" className="muted">No orders found.</td></tr>}
              {orders.map((o) => (
                <tr key={o.id}>
                  <td data-label="Order" className="mono">#{o.id.slice(-8).toUpperCase()}</td>
                  <td data-label="Customer">{o.customerInfo.fullName}<br /><span className="small muted">{o.user?.email}</span></td>
                  <td data-label="Date">{dateFmt(o.createdAt)}</td>
                  <td data-label="Products" className="small">{o.items.map((i) => `${i.name}${i.shade ? ` (${i.shade})` : ''} × ${i.quantity}`).join(', ')}</td>
                  <td data-label="Total">{money(o.total)}</td>
                  <td data-label="Payment">{o.paymentMethod === 'COD' ? 'COD' : 'Demo card'} · {o.paymentStatus}</td>
                  <td data-label="Status">
                    {o.orderStatus === 'Cancelled' ? <StatusPill status="Cancelled" /> : (
                      <select className="input status-select" value={o.orderStatus} disabled={savingId === o.id} onChange={(e) => changeStatus(o, e.target.value)} aria-label="Order status">
                        {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
