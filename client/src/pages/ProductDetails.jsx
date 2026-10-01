import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage } from '../services/api.js';
import ProductImage from '../components/ProductImage.jsx';
import Stars from '../components/Stars.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { money } from '../utils/format.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { notify } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [active, setActive] = useState(0);
  const [shade, setShade] = useState('');
  const [qty, setQty] = useState(1);
  const [shadeError, setShadeError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get(`/products/${id}`)
      .then((r) => {
        setProduct(r.data.product);
        setActive(0);
        setQty(1);
        setShade(r.data.product.shades?.[0]?.name || '');
      })
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner fullPage label="Loading product…" />;
  if (error)
    return (
      <div className="container page empty">
        <h2>We couldn't load this product</h2>
        <p className="muted">{error}</p>
        <Link to="/shop" className="btn btn-primary">Back to shop</Link>
      </div>
    );

  const gallery = product.images?.length ? product.images : [product.image];
  const max = Math.min(10, product.stock);
  const out = product.stock <= 0;
  const hasShades = product.shades.length > 0;

  const add = (goToCart) => {
    if (hasShades && !shade) {
      setShadeError(true);
      return false;
    }
    addItem(product, shade, qty);
    notify(`${product.name} added to your bag`);
    if (goToCart) navigate('/cart');
    return true;
  };

  return (
    <div className="container page">
      <p className="crumbs small"><Link to="/shop">Shop</Link> / <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link></p>
      <div className="pdp">
        <div className="pdp-gallery">
          <div className="pdp-main"><ProductImage src={gallery[active]} alt={product.name} /></div>
          {gallery.length > 1 && (
            <div className="thumbs">
              {gallery.map((g, i) => (
                <button type="button" key={i} className={i === active ? 'active' : ''} onClick={() => setActive(i)} aria-label={`Image ${i + 1}`}>
                  <ProductImage src={g} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pdp-info">
          <p className="muted">{product.brand} · {product.category}</p>
          <h1>{product.name}</h1>
          <Stars rating={product.rating} count={product.reviewCount} />
          <div className="price-row big">
            <strong>{money(product.price)}</strong>
            {product.discount > 0 && (<><s className="muted">{money(product.originalPrice)}</s><span className="badge badge-sale static">{product.discount}% off</span></>)}
          </div>
          <p className={`stock ${out ? 'stock-out' : product.stock <= 5 ? 'stock-low' : 'stock-ok'}`}>
            {out ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}
          </p>
          <p className="desc">{product.description}</p>

          {hasShades && (
            <div className="shades">
              <p><strong>Shade:</strong> {shade || 'Select a shade'}</p>
              <div className="swatches" role="radiogroup" aria-label="Shade">
                {product.shades.map((s) => (
                  <button
                    type="button"
                    key={s.name}
                    role="radio"
                    aria-checked={shade === s.name}
                    title={s.name}
                    className={`swatch ${shade === s.name ? 'active' : ''}`}
                    style={{ background: s.hex }}
                    onClick={() => { setShade(s.name); setShadeError(false); }}
                  ><span className="sr-only">{s.name}</span></button>
                ))}
              </div>
              {shadeError && <p className="field-error">Choose a shade first.</p>}
            </div>
          )}

          <div className="buy-row">
            <div className="qty">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity">−</button>
              <input type="number" min="1" max={max} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(max || 1, Math.floor(Number(e.target.value)) || 1)))} aria-label="Quantity" />
              <button type="button" onClick={() => setQty((q) => Math.min(max, q + 1))} disabled={qty >= max} aria-label="Increase quantity">+</button>
            </div>
            <button type="button" className="btn btn-primary" disabled={out} onClick={() => add(false)}>Add to cart</button>
            <button type="button" className="btn btn-dark" disabled={out} onClick={() => add(true)}>Buy now</button>
          </div>

          <div className="info-blocks">
            {product.benefits.length > 0 && (<section><h3>Benefits</h3><ul>{product.benefits.map((b) => <li key={b}>{b}</li>)}</ul></section>)}
            {product.howToUse && (<section><h3>How to use</h3><p>{product.howToUse}</p></section>)}
            {product.ingredients.length > 0 && (<section><h3>Ingredients</h3><p className="small">{product.ingredients.join(', ')}</p></section>)}
          </div>
        </div>
      </div>
    </div>
  );
}
