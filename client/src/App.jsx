import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Orders from './pages/Orders.jsx';
import OrderDetails from './pages/OrderDetails.jsx';
import TrackOrder from './pages/TrackOrder.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminProductForm from './pages/admin/AdminProductForm.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const guard = (el) => <ProtectedRoute>{el}</ProtectedRoute>;
const admin = (el) => <AdminRoute>{el}</AdminRoute>;

export default function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={guard(<Checkout />)} />
          <Route path="/profile" element={guard(<Profile />)} />
          <Route path="/orders" element={guard(<Orders />)} />
          <Route path="/orders/:id" element={guard(<OrderDetails />)} />
          <Route path="/track-order/:id" element={guard(<TrackOrder />)} />
          <Route path="/admin" element={admin(<AdminDashboard />)} />
          <Route path="/admin/products" element={admin(<AdminProducts />)} />
          <Route path="/admin/products/new" element={admin(<AdminProductForm />)} />
          <Route path="/admin/products/edit/:id" element={admin(<AdminProductForm />)} />
          <Route path="/admin/orders" element={admin(<AdminOrders />)} />
          <Route path="/admin/users" element={admin(<AdminUsers />)} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
