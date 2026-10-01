import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { errorMessage } from '../services/api.js';

export default function Login() {
  const { user, login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) return setError('Enter your email and password');
    setBusy(true);
    try {
      const u = await login(email.trim(), password);
      notify(`Welcome back, ${u.name.split(' ')[0]}`);
      navigate(from === '/' && u.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="card pad auth-card" onSubmit={submit} noValidate>
        <h1>Log in</h1>
        {location.state?.from && <p className="muted">Log in to continue.</p>}
        {error && <div className="notice notice-error" role="alert">{error}</div>}
        <label className="field"><span>Email</span><input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
        <label className="field"><span>Password</span><input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        <p className="small">New here? <Link to="/register" state={location.state}>Create an account</Link></p>
        <div className="demo-box small">
          <strong>Demo accounts</strong>
          <p>Admin: admin@beautystore.com / Admin@123</p>
          <p>Customer: user@beautystore.com / User@123</p>
        </div>
      </form>
    </div>
  );
}
