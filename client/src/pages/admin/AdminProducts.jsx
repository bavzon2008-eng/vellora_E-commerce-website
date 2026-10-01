import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../../services/api.js';
import AdminLayout from '../../components/AdminLayout.jsx';
import ProductImage from '../../components/ProductImage.jsx';
import Pagination from '../../components/Pagination.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import Modal from '../../components/Modal.jsx';
import useDebounce from '../../hooks/useDebounce.js';
import { useToast } from '../../context/ToastContext.jsx';
import { money } from '../../utils/format.js';

export default function AdminProducts() {
  const { notify } = useToast();
  const [data, setData] = useState({ products: [], pages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.get('/products', { params: { page, limit: 10, search: debounced, sort: 'newest' } })
      .then((r) => setData(r.data))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, [page, debounced]);

  useEffect(() => { setPage(1); }, [debounced]);
  useEffect(() => { load(); }, [load]);

  const remove = async () => {
    setBusy(true);
    try {
      await api.delete(`/products/${toDelete.id}`);
      notify('Product deleted');
      setToDelete(null);
      if (data.products.length === 1 && page > 1) setPage(page - 1); else load();
    } catch (e) {
      notify(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminLayout title="Products" actions={<Link to="/admin/products/new" className="btn btn-primary">Add product</Link>}>
      <input className="input" type="search" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 360, marginBottom: 16 }} aria-label="Search products" />
      {error && <div className="notice notice-error">{error}</div>}
      {loading ? <LoadingSpinner label="Loading products…" /> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Image</th><th>Product</th><th>Brand</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr></thead>
            <tbody>
              {data.products.length === 0 && <tr><td colSpan="8" className="muted">No products found.</td></tr>}
              {data.products.map((p) => (
                <tr key={p.id}>
                  <td data-label="Image"><div className="tbl-thumb"><ProductImage src={p.image} alt={p.name} /></div></td>
                  <td data-label="Product">{p.name}</td>
                  <td data-label="Brand">{p.brand}</td>
                  <td data-label="Category">{p.category}</td>
                  <td data-label="Price">{money(p.price)}</td>
                  <td data-label="Stock" className={p.stock === 0 ? 'stock-out' : p.stock <= 5 ? 'stock-low' : ''}>{p.stock}</td>
                  <td data-label="Rating">{p.rating.toFixed(1)}</td>
                  <td data-label="Actions" className="actions">
                    <Link to={`/admin/products/edit/${p.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => setToDelete(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pages={data.pages} onChange={setPage} />
      <Modal
        open={!!toDelete}
        title="Delete this product?"
        onClose={() => setToDelete(null)}
        actions={<>
          <button type="button" className="btn btn-ghost" onClick={() => setToDelete(null)}>Cancel</button>
          <button type="button" className="btn btn-danger" disabled={busy} onClick={remove}>{busy ? 'Deleting…' : 'Delete product'}</button>
        </>}
      >
        {toDelete && <>“{toDelete.name}” will be removed from the catalog. Existing orders keep their own copy of the item details.</>}
      </Modal>
    </AdminLayout>
  );
}
