import { Link } from 'react-router-dom';
import ProductImage from './ProductImage.jsx';
import Stars from './Stars.jsx';
import { money } from '../utils/format.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { notify } = useToast();
  const out = product.stock <= 0;
  const hasShades = product.shades?.length > 0;

  const handleAdd = () => {
    addItem(product, hasShades ? product.shades[0].name : '', 1);
    notify(hasShades ? `Added in ${product.shades[0].name}. Change the shade in your bag.` : 'Added to your bag');
  };

  return (
    <article className="card product-card">
      <Link to={`/product/${product.id}`} className="product-media">
        <ProductImage src={product.image} alt={product.name} />
        {product.discount > 0 && <span className="badge badge-sale">{product.discount}% off</span>}
        {out && <span className="badge badge-out">Sold out</span>}
      </Link>
      <div className="product-info">
        <p className="muted small">{product.brand} · {product.category}</p>
        <h3 className="product-name"><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
        <Stars rating={product.rating} count={product.reviewCount} />
        <div className="price-row">
          <strong>{money(product.price)}</strong>
          {product.discount > 0 && <s className="muted">{money(product.originalPrice)}</s>}
        </div>
        <p className={`stock ${out ? 'stock-out' : product.stock <= 5 ? 'stock-low' : 'stock-ok'}`}>
          {out ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}
        </p>
        <div className="card-actions">
          <button type="button" className="btn btn-primary btn-sm" disabled={out} onClick={handleAdd}>Add to cart</button>
          <Link to={`/product/${product.id}`} className="btn btn-ghost btn-sm">View details</Link>
        </div>
      </div>
    </article>
  );
}
