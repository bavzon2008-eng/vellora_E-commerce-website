import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../services/api.js';
import ProductGrid from '../components/ProductGrid.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { GROUPS } from '../utils/format.js';

const WALL = ['#F5DCC6', '#A62E2E', '#E58A9B', '#C9955F', '#7B2A4D', '#EAD3A6', '#E2674F', '#6E4630', '#C98A83', '#B67A8C', '#DDB48C', '#8C4A68'];
const GROUP_NOTE = {
  Face: 'Bases, concealers, primers and sets',
  Eyes: 'Shadow, liner, mascara and brows',
  Lips: 'Lipsticks, glosses, tints and liners',
  Cheeks: 'Blush, highlighter and contour',
  Skincare: 'Cleanse, hydrate and remove',
  'Brushes & Tools': 'Brushes, sponges and curlers',
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/products', { params: { sort: 'rating', limit: 8 } })
      .then((r) => setProducts(r.data.products))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>Beauty that feels like you</h1>
            <p>Foundations, lip colours and skincare from the brands you already reach for, with shade swatches so you can pick your match before you buy.</p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary">Shop now</Link>
              <a href="#categories" className="btn btn-ghost">Explore categories</a>
            </div>
          </div>
          <div className="shade-wall" aria-hidden="true">
            {WALL.map((c, i) => (<span key={c} style={{ background: c, animationDelay: `${i * 60}ms` }} className={`tile t${i % 4}`} />))}
          </div>
        </div>
      </section>

      <section className="container section" id="categories">
        <h2>Shop by category</h2>
        <div className="cat-grid">
          {GROUPS.map((g) => (
            <Link key={g} to={`/shop?category=${encodeURIComponent(g)}`} className="cat-card">
              <strong>{g}</strong>
              <span className="small muted">{GROUP_NOTE[g]}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Top rated right now</h2>
          <Link to="/shop?sort=rating" className="link-btn">See all products</Link>
        </div>
        {loading && <LoadingSpinner label="Loading products…" />}
        {error && <div className="notice notice-error">{error}</div>}
        {!loading && !error && <ProductGrid products={products} />}
      </section>

      <section className="container section perks">
        <div><strong>Free shipping above ₹999</strong><p className="small muted">Flat ₹59 on smaller orders.</p></div>
        <div><strong>Pick your shade first</strong><p className="small muted">Every shade-based product shows colour swatches.</p></div>
        <div><strong>Track every order</strong><p className="small muted">See each step from placed to delivered.</p></div>
      </section>
    </>
  );
}
