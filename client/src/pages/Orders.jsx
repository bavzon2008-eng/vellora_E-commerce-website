import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../services/api.js';
import OrderCard from '../components/OrderCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/orders/my-orders').then((r) => setOrders(r.data.orders)).catch((e) => setError(errorMessage(e))).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container page">
      <h1>My orders</h1>
      {loading && <LoadingSpinner label="Loading orders…" />}
      {error && <div className="notice notice-error">{error}</div>}
      {!loading && !error && orders.length === 0 && (
        <div className="empty"><h3>No orders yet</h3><p className="muted">When you place an order it will show up here.</p><Link to="/shop" className="btn btn-primary">Start shopping</Link></div>
      )}
      <div className="stack">{orders.map((o) => <OrderCard key={o.id} order={o} />)}</div>
    </div>
  );
}
