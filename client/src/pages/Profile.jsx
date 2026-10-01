import { useEffect, useState } from 'react';
import api, { errorMessage } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import OrderCard from '../components/OrderCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { notify } = useToast();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '' });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/orders/my-orders').then((r) => setOrders(r.data.orders)).catch((e) => setError(errorMessage(e))).finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      notify('Profile updated');
    } catch (err) {
      notify(errorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container page">
      <h1>My profile</h1>
      <div className="profile-grid">
        <form className="card pad stack" onSubmit={save}>
          <label className="field"><span>Name</span><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="field"><span>Email</span><input className="input" value={user.email} disabled /></label>
          <label className="field"><span>Phone</span><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Add a phone number" /></label>
          <p className="small muted">Role: <strong>{user.role}</strong></p>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
        </form>
        <div>
          <h2>My orders</h2>
          {loading && <LoadingSpinner label="Loading orders…" />}
          {error && <div className="notice notice-error">{error}</div>}
          {!loading && !error && orders.length === 0 && (<div className="empty small-empty"><p>You haven't placed an order yet.</p><Link to="/shop" className="btn btn-primary">Start shopping</Link></div>)}
          <div className="stack">{orders.slice(0, 3).map((o) => <OrderCard key={o.id} order={o} />)}</div>
          {orders.length > 3 && <Link to="/orders" className="link-btn">See all {orders.length} orders</Link>}
        </div>
      </div>
    </div>
  );
}
