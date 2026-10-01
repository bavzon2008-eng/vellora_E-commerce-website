import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { errorMessage } from '../services/api.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const STRONG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function Register() {
  const { user, register } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setApiError('');
    const er = {};
    if (form.name.trim().length < 2) er.name = 'Enter your full name';
    if (!EMAIL_RE.test(form.email)) er.email = 'Enter a valid email address';
    if (!STRONG.test(form.password)) er.password = 'Use 8+ characters with upper case, lower case and a number';
    if (form.confirmPassword !== form.password) er.confirmPassword = 'Passwords do not match';
    setErrors(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      await register({ ...form, name: form.name.trim(), email: form.email.trim() });
      notify('Account created. Welcome to Vellora');
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const field = (k, label, type = 'text', auto) => (
    <label className="field">
      <span>{label}</span>
      <input className={`input ${errors[k] ? 'invalid' : ''}`} type={type} value={form[k]} onChange={set(k)} autoComplete={auto} />
      {errors[k] && <span className="field-error">{errors[k]}</span>}
    </label>
  );

  return (
    <div className="auth-page">
      <form className="card pad auth-card" onSubmit={submit} noValidate>
        <h1>Create account</h1>
        {apiError && <div className="notice notice-error" role="alert">{apiError}</div>}
        {field('name', 'Full name', 'text', 'name')}
        {field('email', 'Email', 'email', 'email')}
        {field('password', 'Password', 'password', 'new-password')}
        {field('confirmPassword', 'Confirm password', 'password', 'new-password')}
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Creating account…' : 'Register'}</button>
        <p className="small">Already registered? <Link to="/login" state={location.state}>Log in</Link></p>
      </form>
    </div>
  );
}
