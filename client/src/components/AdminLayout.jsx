import { NavLink } from 'react-router-dom';

const LINKS = [
  ['/admin', 'Dashboard', true],
  ['/admin/products', 'Products'],
  ['/admin/orders', 'Orders'],
  ['/admin/users', 'Customers'],
];

export default function AdminLayout({ title, actions, children }) {
  return (
    <div className="container page">
      <nav className="admin-tabs" aria-label="Admin">
        {LINKS.map(([to, label, end]) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'active' : '')}>{label}</NavLink>
        ))}
      </nav>
      <div className="page-head">
        <h1>{title}</h1>
        <div>{actions}</div>
      </div>
      {children}
    </div>
  );
}
