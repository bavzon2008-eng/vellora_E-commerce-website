import { useEffect, useState } from 'react';
import api, { errorMessage } from '../../services/api.js';
import AdminLayout from '../../components/AdminLayout.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { dateFmt } from '../../utils/format.js';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users').then((r) => setUsers(r.data.users)).catch((e) => setError(errorMessage(e))).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Customers">
      {error && <div className="notice notice-error">{error}</div>}
      {loading ? <LoadingSpinner label="Loading users…" /> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Registered</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td data-label="Name">{u.name}</td>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Role"><span className={`pill ${u.role === 'admin' ? 'pill-shipped' : 'pill-pending'}`}>{u.role}</span></td>
                  <td data-label="Registered">{dateFmt(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
