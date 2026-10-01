export const money = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

export const dateFmt = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const dateTimeFmt = (d) =>
  new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

export const GROUPS = ['Face', 'Eyes', 'Lips', 'Cheeks', 'Skincare', 'Brushes & Tools'];

export const CATEGORY_GROUPS = {
  Face: ['Foundation', 'Concealer', 'Primer', 'Setting Powder', 'Setting Spray'],
  Eyes: ['Eyeshadow', 'Eyeliner', 'Mascara', 'Eyebrow Pencil', 'Kajal'],
  Lips: ['Lipstick', 'Lip Gloss', 'Lip Liner', 'Lip Tint', 'Liquid Lipstick'],
  Cheeks: ['Blush', 'Highlighter', 'Contour'],
  Skincare: ['Cleanser', 'Moisturizer', 'Face Serum', 'Makeup Remover'],
  'Brushes & Tools': ['Makeup Brushes', 'Beauty Blender', 'Makeup Sponge', 'Eyelash Curler'],
};
export const ALL_CATEGORIES = Object.values(CATEGORY_GROUPS).flat();

export const FREE_SHIPPING_ABOVE = 999;
export const SHIPPING_FEE = 59;
