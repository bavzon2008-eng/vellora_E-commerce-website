import { Link } from 'react-router-dom';
import ProductImage from './ProductImage.jsx';
import { money } from '../utils/format.js';
import { useCart } from '../context/CartContext.jsx';

export default function CartItem({ item }) {
  const { setQuantity, removeItem } = useCart();
  return (
    <div className="cart-item">
      <Link to={`/product/${item.productId}`} className="cart-thumb"><ProductImage src={item.image} alt={item.name} /></Link>
      <div className="cart-main">
        <p className="muted small">{item.brand}</p>
        <Link to={`/product/${item.productId}`} className="cart-name">{item.name}</Link>
        {item.shade && <p className="small">Shade: <strong>{item.shade}</strong></p>}
        <p className="small muted">{money(item.price)} each</p>
        {item.quantity >= item.stock && <p className="small stock-low">Maximum available quantity</p>}
      </div>
      <div className="cart-qty">
        <div className="qty">
          <button type="button" onClick={() => setQuantity(item.key, item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Decrease quantity">−</button>
          <input type="number" min="1" max={Math.min(10, item.stock)} value={item.quantity} onChange={(e) => setQuantity(item.key, e.target.value)} aria-label="Quantity" />
          <button type="button" onClick={() => setQuantity(item.key, item.quantity + 1)} disabled={item.quantity >= Math.min(10, item.stock)} aria-label="Increase quantity">+</button>
        </div>
        <button type="button" className="link-btn" onClick={() => removeItem(item.key)}>Remove</button>
      </div>
      <strong className="cart-total">{money(item.price * item.quantity)}</strong>
    </div>
  );
}
