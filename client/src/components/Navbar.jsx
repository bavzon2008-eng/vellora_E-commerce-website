import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import SearchBar from './SearchBar.jsx';
import { GROUPS } from '../utils/format.js';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [cats, setCats] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setOpen(false);
    setMenu(false);
    setCats(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const close = (e) => menuRef.current && !menuRef.current.contains(e.target) && (setMenu(false), setCats(false));
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const doLogout = () => {
    logout();
    notify('You have been logged out');
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-inner" ref={menuRef}>
        <button type="button" className="icon-btn nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
          <span className="burger" />
        </button>
        <Link to="/" className="logo">Vellora</Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/shop" end>Shop</NavLink>
          <div className="dropdown">
            <button type="button" className="nav-btn" onClick={() => setCats((c) => !c)} aria-expanded={cats}>Categories ▾</button>
            {cats && (
              <div className="dropdown-menu">
                {GROUPS.map((g) => (<Link key={g} to={`/shop?category=${encodeURIComponent(g)}`}>{g}</Link>))}
              </div>
            )}
          </div>
          <NavLink to="/about">About</NavLink>
          <div className="nav-search-mobile"><SearchBar onDone={() => setOpen(false)} /></div>
        </nav>

        <div className="nav-search"><SearchBar /></div>

        <div className="nav-right">
          <Link to="/cart" className="icon-btn cart-link" aria-label={`Bag, ${count} items`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 016 0v2" /></svg>
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
          {user ? (
            <div className="dropdown">
              <button type="button" className="nav-btn user-btn" onClick={() => setMenu((m) => !m)} aria-expanded={menu}>
                {user.name.split(' ')[0]} ▾
              </button>
              {menu && (
                <div className="dropdown-menu right">
                  <Link to="/profile">Profile</Link>
                  <Link to="/orders">My orders</Link>
                  {isAdmin && <Link to="/admin">Admin dashboard</Link>}
                  <button type="button" onClick={doLogout}>Log out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
