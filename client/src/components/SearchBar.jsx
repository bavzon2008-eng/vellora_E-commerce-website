import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Navbar search: sends the visitor to /shop?search=...
export default function SearchBar({ onDone }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/shop?search=${encodeURIComponent(term)}` : '/shop');
    setQ('');
    onDone?.();
  };

  return (
    <form className="searchbar" onSubmit={submit} role="search">
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, brands…" aria-label="Search products" />
      <button type="submit" className="btn btn-primary btn-sm">Search</button>
    </form>
  );
}
