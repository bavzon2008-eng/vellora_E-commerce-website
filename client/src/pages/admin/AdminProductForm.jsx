import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage } from '../../services/api.js';
import AdminLayout from '../../components/AdminLayout.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ProductImage from '../../components/ProductImage.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { CATEGORY_GROUPS } from '../../utils/format.js';

const EMPTY = {
  name: '', brand: '', category: 'Foundation', description: '', price: '', originalPrice: '', stock: '',
  rating: '4', reviewCount: '0', image: '', ingredients: '', benefits: '', howToUse: '', shades: '',
};

const lines = (s) => s.split('\n').map((x) => x.trim()).filter(Boolean);
// shades textarea: one per line, "Name | #hex"
const parseShades = (s) =>
  lines(s).map((l) => {
    const [name, hex] = l.split('|').map((x) => x.trim());
    return { name, hex: hex || '#cccccc' };
  });

export default function AdminProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const { notify } = useToast();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(editing);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api.get(`/products/${id}`)
      .then((r) => {
        const p = r.data.product;
        setForm({
          name: p.name, brand: p.brand, category: p.category, description: p.description,
          price: String(p.price), originalPrice: String(p.originalPrice ?? ''), stock: String(p.stock),
          rating: String(p.rating), reviewCount: String(p.reviewCount), image: p.image || '',
          ingredients: p.ingredients.join('\n'), benefits: p.benefits.join('\n'), howToUse: p.howToUse || '',
          shades: p.shades.map((s) => `${s.name} | ${s.hex}`).join('\n'),
        });
      })
      .catch((e) => setLoadError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, [id, editing]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    const num = (k) => Number(form[k]);
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.brand.trim()) e.brand = 'Brand is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.price === '' || Number.isNaN(num('price')) || num('price') < 0) e.price = 'Enter a price of 0 or more';
    if (form.originalPrice !== '' && (Number.isNaN(num('originalPrice')) || num('originalPrice') < 0)) e.originalPrice = 'Enter 0 or more';
    if (form.originalPrice !== '' && !e.price && num('originalPrice') < num('price')) e.originalPrice = 'Original price cannot be lower than the price';
    if (form.stock === '' || !Number.isInteger(num('stock')) || num('stock') < 0) e.stock = 'Enter a whole number of 0 or more';
    if (form.rating === '' || num('rating') < 0 || num('rating') > 5) e.rating = 'Rating must be between 0 and 5';
    if (form.reviewCount === '' || !Number.isInteger(num('reviewCount')) || num('reviewCount') < 0) e.reviewCount = 'Enter a whole number of 0 or more';
    if (form.image.trim() && !/^https?:\/\//i.test(form.image.trim())) e.image = 'Use a full http(s) image URL';
    const badShade = parseShades(form.shades).find((s) => !/^#[0-9a-fA-F]{3,8}$/.test(s.hex));
    if (badShade) e.shades = `Fix the colour for "${badShade.name}". Use a format like Rose | #E58A9B`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const img = form.image.trim();
    const payload = {
      name: form.name.trim(), brand: form.brand.trim(), category: form.category, description: form.description.trim(),
      price: Number(form.price), originalPrice: form.originalPrice === '' ? undefined : Number(form.originalPrice),
      stock: Number(form.stock), rating: Number(form.rating), reviewCount: Number(form.reviewCount),
      image: img, images: img ? [img] : [],
      ingredients: lines(form.ingredients), benefits: lines(form.benefits), howToUse: form.howToUse.trim(),
      shades: parseShades(form.shades),
    };
    try {
      if (editing) await api.put(`/products/${id}`, payload); else await api.post('/products', payload);
      notify(editing ? 'Product updated' : 'Product added');
      navigate('/admin/products');
    } catch (err) {
      notify(errorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout title="Edit product"><LoadingSpinner label="Loading product…" /></AdminLayout>;
  if (loadError) return <AdminLayout title="Edit product"><div className="notice notice-error">{loadError}</div></AdminLayout>;

  const text = (k, label, props = {}) => (
    <label className={`field ${props.wide ? 'wide' : ''}`}>
      <span>{label}</span>
      <input className={`input ${errors[k] ? 'invalid' : ''}`} value={form[k]} onChange={set(k)} {...props} />
      {errors[k] && <span className="field-error">{errors[k]}</span>}
    </label>
  );
  const area = (k, label, hint, rows = 4) => (
    <label className="field wide">
      <span>{label}{hint && <em className="muted small"> {hint}</em>}</span>
      <textarea className={`input ${errors[k] ? 'invalid' : ''}`} rows={rows} value={form[k]} onChange={set(k)} />
      {errors[k] && <span className="field-error">{errors[k]}</span>}
    </label>
  );

  return (
    <AdminLayout title={editing ? 'Edit product' : 'Add product'}>
      <form className="card pad" onSubmit={submit} noValidate>
        <div className="form-grid">
          {text('name', 'Product name', { wide: true })}
          {text('brand', 'Brand')}
          <label className="field"><span>Category</span>
            <select className="input" value={form.category} onChange={set('category')}>
              {Object.entries(CATEGORY_GROUPS).map(([g, subs]) => (<optgroup key={g} label={g}>{subs.map((s) => <option key={s}>{s}</option>)}</optgroup>))}
            </select>
          </label>
          {area('description', 'Description')}
          {text('price', 'Price (₹)', { type: 'number', min: 0, step: '0.01' })}
          {text('originalPrice', 'Original price (₹)', { type: 'number', min: 0, step: '0.01' })}
          {text('stock', 'Stock', { type: 'number', min: 0, step: 1 })}
          {text('rating', 'Rating (0–5)', { type: 'number', min: 0, max: 5, step: '0.1' })}
          {text('reviewCount', 'Review count', { type: 'number', min: 0, step: 1 })}
          {text('image', 'Image URL', { wide: true, placeholder: 'https://…' })}
          <div className="wide img-preview"><ProductImage src={form.image.trim()} alt="Preview" /><span className="small muted">Preview. A fallback image shows if the URL fails.</span></div>
          {area('ingredients', 'Ingredients', '(one per line)')}
          {area('benefits', 'Benefits', '(one per line)')}
          {area('howToUse', 'How to use', '', 3)}
          {area('shades', 'Shades', '(one per line, like: Rose | #E58A9B)')}
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/products')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add product'}</button>
        </div>
      </form>
    </AdminLayout>
  );
}
