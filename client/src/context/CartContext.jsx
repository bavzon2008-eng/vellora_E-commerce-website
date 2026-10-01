import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { FREE_SHIPPING_ABOVE, SHIPPING_FEE } from '../utils/format.js';

const CartContext = createContext(null);
const MAX_QTY = 10;

const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};
const lineKey = (productId, shade) => `${productId}|${shade || ''}`;

function merge(a, b) {
  const out = [...a];
  b.forEach((item) => {
    const found = out.find((x) => x.key === item.key);
    if (found) found.quantity = Math.min(found.quantity + item.quantity, Math.min(MAX_QTY, item.stock || MAX_QTY));
    else out.push(item);
  });
  return out;
}

export function CartProvider({ children }) {
  const { user, loading } = useAuth();
  const storageKey = user ? `cart_${user.id}` : 'cart_guest';
  const [items, setItems] = useState([]);
  const [loadedKey, setLoadedKey] = useState(null);

  // Load the cart for the current user (guest cart merges into the user's cart at login)
  useEffect(() => {
    if (loading) return;
    let stored = read(storageKey);
    if (user) {
      const guest = read('cart_guest');
      if (guest.length) {
        stored = merge(stored, guest);
        localStorage.removeItem('cart_guest');
      }
    }
    setItems(stored);
    setLoadedKey(storageKey);
  }, [storageKey, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist
  useEffect(() => {
    if (loadedKey === storageKey) localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey, loadedKey]);

  const addItem = (product, shade, quantity = 1) => {
    const key = lineKey(product.id, shade);
    const cap = Math.min(MAX_QTY, product.stock);
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) return prev.map((i) => (i.key === key ? { ...i, stock: product.stock, quantity: Math.min(i.quantity + quantity, cap) } : i));
      return [
        ...prev,
        { key, productId: product.id, name: product.name, brand: product.brand, image: product.image, price: product.price, stock: product.stock, shade: shade || '', quantity: Math.min(quantity, cap) },
      ];
    });
  };

  const setQuantity = (key, qty) => {
    const n = Math.floor(Number(qty));
    if (Number.isNaN(n)) return;
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, Math.min(n, MAX_QTY, i.stock || MAX_QTY)) } : i))
    );
  };

  const removeItem = (key) => setItems((prev) => prev.filter((i) => i.key !== key));
  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
    return { count, subtotal, shipping, total: subtotal + shipping };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addItem, setQuantity, removeItem, clearCart, ...totals }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
