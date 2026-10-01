import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <p className="logo logo-light">Vellora</p>
          <p className="small">A multi-brand makeup marketplace. This is a demo project: no real orders, payments or deliveries take place.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <Link to="/shop?category=Face">Face</Link>
          <Link to="/shop?category=Eyes">Eyes</Link>
          <Link to="/shop?category=Lips">Lips</Link>
          <Link to="/shop?category=Skincare">Skincare</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link to="/profile">Profile</Link>
          <Link to="/orders">My orders</Link>
          <Link to="/cart">Bag</Link>
        </div>
      </div>
      <div className="container footer-legal small">
        Brand names and product names belong to their respective owners and appear only as demo catalog data. Vellora is a fictional store and is not affiliated with, sponsored by or endorsed by any brand shown, nor an authorised retailer of them.
      </div>
    </footer>
  );
}
