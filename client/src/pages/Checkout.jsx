import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errorMessage } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { OrderSummary } from './Cart.jsx';
import ProductImage from '../components/ProductImage.jsx';
import { money } from '../utils/format.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Checkout() {
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    address: '', city: '', state: '', postalCode: '', country: 'India',
  });
  const [payment, setPayment] = useState('COD');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [busy, setBusy] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container page empty">
        <h2>Your beauty bag is empty.</h2>
        <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Enter your full name';
    if (!EMAIL_RE.test(form.email)) e.email = 'Enter a valid email address';
    if (!/^[0-9+\-\s]{7,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
    ['address', 'city', 'state', 'country'].forEach((k) => { if (!form[k].trim()) e[k] = 'This field is required'; });
    if (!/^[A-Za-z0-9\- ]{3,10}$/.test(form.postalCode)) e.postalCode = 'Enter a valid postal code';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setApiError('');
    if (!validate()) return;
    setBusy(true);
    try {
      const { fullName, email, phone, ...addr } = form;
      const res = await api.post('/orders', {
        customerInfo: { fullName, email, phone },
        shippingAddress: addr,
        paymentMethod: payment,
        items: items.map((i) => ({ product: i.productId, quantity: i.quantity, shade: i.shade })),
      });
      clearCart();
      notify('Order placed successfully');
      navigate(`/orders/${res.data.order.id}`, { state: { confirmed: true }, replace: true });
    } catch (err) {
      setApiError(errorMessage(err));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setBusy(false);
    }
  };

  const field = (k, label, props = {}) => (
    <label className={`field ${props.wide ? 'wide' : ''}`}>
      <span>{label}</span>
      <input className={`input ${errors[k] ? 'invalid' : ''}`} value={form[k]} onChange={set(k)} {...props} />
      {errors[k] && <span className="field-error">{errors[k]}</span>}
    </label>
  );

  return (
    <div className="container page">
      <h1>Checkout</h1>
      {apiError && <div className="notice notice-error" role="alert">{apiError}</div>}
      <form className="cart-layout" onSubmit={submit} noValidate>
        <div className="stack">
          <section className="card pad">
            <h3>Customer details</h3>
            <div className="form-grid">
              {field('fullName', 'Full name', { autoComplete: 'name', wide: true })}
              {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
              {field('phone', 'Phone', { type: 'tel', autoComplete: 'tel' })}
            </div>
          </section>
          <section className="card pad">
            <h3>Shipping address</h3>
            <div className="form-grid">
              {field('address', 'Address', { wide: true, autoComplete: 'street-address' })}
              {field('city', 'City')}
              {field('state', 'State')}
              {field('postalCode', 'Postal code')}
              {field('country', 'Country')}
            </div>
          </section>
          <section className="card pad">
            <h3>Payment</h3>
            <label className={`pay-opt ${payment === 'COD' ? 'active' : ''}`}>
              <input type="radio" name="pay" checked={payment === 'COD'} onChange={() => setPayment('COD')} />
              <span><strong>Cash on Delivery</strong><br /><span className="small muted">Pay when your order arrives.</span></span>
            </label>
            <label className={`pay-opt ${payment === 'DEMO_CARD' ? 'active' : ''}`}>
              <input type="radio" name="pay" checked={payment === 'DEMO_CARD'} onChange={() => setPayment('DEMO_CARD')} />
              <span><strong>Card (Demo Payment)</strong><br /><span className="small muted">Simulation only. No card details are collected or stored, and no money moves.</span></span>
            </label>
          </section>
        </div>

        <div className="stack">
          <div className="card pad">
            <h3>Your items</h3>
            {items.map((i) => (
              <div key={i.key} className="mini-item">
                <div className="mini-thumb"><ProductImage src={i.image} alt={i.name} /></div>
                <div><p className="small"><strong>{i.name}</strong></p><p className="small muted">{i.shade ? `${i.shade} · ` : ''}Qty {i.quantity}</p></div>
                <span className="small">{money(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <OrderSummary>
            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Placing order…' : 'Place order'}</button>
          </OrderSummary>
        </div>
      </form>
    </div>
  );
}
