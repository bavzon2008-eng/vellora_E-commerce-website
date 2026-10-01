import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import CartItem from '../components/CartItem.jsx';
import Modal from '../components/Modal.jsx';
import { money, FREE_SHIPPING_ABOVE } from '../utils/format.js';

export function OrderSummary({ children }) {
  const { subtotal, shipping, total } = useCart();
  return (
    <aside className="card summary">
      <h3>Order summary</h3>
      <div className="sum-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
      <div className="sum-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : money(shipping)}</span></div>
      <div className="sum-row"><span>Discount</span><span>{money(0)}</span></div>
      {shipping > 0 && <p className="small muted">Add {money(FREE_SHIPPING_ABOVE - subtotal)} more for free shipping.</p>}
      <div className="sum-row total"><span>Total</span><span>{money(total)}</span></div>
      {children}
    </aside>
  );
}

export default function Cart() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container page empty">
        <h2>Your beauty bag is empty.</h2>
        <p className="muted">Browse the catalog and add something you love.</p>
        <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  const checkout = () => navigate(user ? '/checkout' : '/login', { state: { from: '/checkout' } });

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Your bag</h1>
        <button type="button" className="link-btn" onClick={() => setConfirm(true)}>Clear cart</button>
      </div>
      <div className="cart-layout">
        <div className="card cart-list">{items.map((i) => <CartItem key={i.key} item={i} />)}</div>
        <OrderSummary>
          <button type="button" className="btn btn-primary btn-block" onClick={checkout}>{user ? 'Proceed to checkout' : 'Log in to check out'}</button>
          <Link to="/shop" className="btn btn-ghost btn-block">Continue Shopping</Link>
        </OrderSummary>
      </div>
      <Modal
        open={confirm}
        title="Clear your bag?"
        onClose={() => setConfirm(false)}
        actions={<>
          <button type="button" className="btn btn-ghost" onClick={() => setConfirm(false)}>Keep items</button>
          <button type="button" className="btn btn-dark" onClick={() => { clearCart(); setConfirm(false); }}>Clear cart</button>
        </>}
      >
        This removes all {items.length} item{items.length > 1 ? 's' : ''} from your bag.
      </Modal>
    </div>
  );
}
