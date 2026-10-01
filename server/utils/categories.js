const CATEGORY_GROUPS = {
  Face: ['Foundation', 'Concealer', 'Primer', 'Setting Powder', 'Setting Spray'],
  Eyes: ['Eyeshadow', 'Eyeliner', 'Mascara', 'Eyebrow Pencil', 'Kajal'],
  Lips: ['Lipstick', 'Lip Gloss', 'Lip Liner', 'Lip Tint', 'Liquid Lipstick'],
  Cheeks: ['Blush', 'Highlighter', 'Contour'],
  Skincare: ['Cleanser', 'Moisturizer', 'Face Serum', 'Makeup Remover'],
  'Brushes & Tools': ['Makeup Brushes', 'Beauty Blender', 'Makeup Sponge', 'Eyelash Curler'],
};

const ALL_CATEGORIES = Object.values(CATEGORY_GROUPS).flat();

function groupOf(category) {
  return Object.keys(CATEGORY_GROUPS).find((g) => CATEGORY_GROUPS[g].includes(category)) || 'Face';
}

module.exports = { CATEGORY_GROUPS, ALL_CATEGORIES, groupOf };
