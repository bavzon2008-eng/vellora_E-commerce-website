require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const { groupOf } = require('./utils/categories');

// ---- Shade palettes -------------------------------------------------------
const S = {
  foundation: [['Ivory 01', '#F5DCC6'], ['Beige 02', '#EBC7A6'], ['Sand 03', '#DDB48C'], ['Honey 04', '#C9955F'], ['Caramel 05', '#A8714A'], ['Espresso 06', '#6E4630']],
  concealer: [['Light', '#F2D4B7'], ['Medium', '#E0B48E'], ['Tan', '#C58F62'], ['Deep', '#8F5B3C']],
  powder: [['Translucent', '#F6E8DA'], ['Light', '#EBD2B8'], ['Deep', '#B5865F']],
  lip: [['Rosewood', '#A4545A'], ['Brick Red', '#A62E2E'], ['Nude Pink', '#C98A83'], ['Berry', '#7B2A4D'], ['Coral', '#E2674F']],
  gloss: [['Clear', '#F4D9DA'], ['Rosy', '#E8A0A8'], ['Caramel', '#C98B63'], ['Plum', '#8C4A68']],
  blush: [['Peach', '#F2A28C'], ['Rose', '#E58A9B'], ['Berry', '#B24A6B'], ['Mauve', '#B67A8C']],
  highlighter: [['Champagne', '#EAD3A6'], ['Rose Gold', '#E5B5A0'], ['Pearl', '#F1E6E0']],
  contour: [['Light', '#C9A184'], ['Medium', '#A57654'], ['Deep', '#7B4F38']],
  brow: [['Blonde', '#B79A72'], ['Brown', '#7A5A40'], ['Dark Brown', '#4A3427'], ['Black', '#1E1A19']],
  liner: [['Black', '#151313'], ['Brown', '#4B3126'], ['Teal', '#1F6F72']],
  mascara: [['Black', '#151313'], ['Brown', '#4A3427']],
  shadow: [['Warm Nudes', '#C99A82'], ['Smoky Cool', '#7C7480'], ['Sunset', '#D1704E']],
};

// ---- Content templates per category (original wording) --------------------
const T = {
  Foundation: ['A base for even-looking skin with a comfortable finish that sits well under powder or on its own.', ['Water', 'Dimethicone', 'Glycerin', 'Talc', 'Titanium Dioxide', 'Iron Oxides'], ['Evens out skin tone', 'Lightweight feel', 'Buildable coverage', 'Works across a range of undertones'], 'Apply a few dots to the face and blend outward with a sponge, brush or fingertips.'],
  Concealer: ['A creamy concealer for brightening under-eyes and softening blemishes without a heavy feel.', ['Water', 'Cyclopentasiloxane', 'Glycerin', 'Titanium Dioxide', 'Vitamin E', 'Iron Oxides'], ['Brightens under-eyes', 'Covers spots and redness', 'Blends smoothly'], 'Dab onto the area to be covered and pat in with a fingertip or sponge.'],
  Primer: ['A smoothing primer that preps skin for makeup and helps it stay put through the day.', ['Dimethicone', 'Glycerin', 'Silica', 'Niacinamide', 'Tocopheryl Acetate'], ['Smooths the look of pores', 'Helps makeup last longer', 'Lightweight gel feel'], 'Warm a small amount between your fingers and press onto clean, moisturised skin before makeup.'],
  'Setting Powder': ['A fine powder that sets liquid and cream products and keeps shine in check.', ['Talc', 'Silica', 'Mica', 'Zinc Stearate', 'Iron Oxides'], ['Sets makeup', 'Controls shine', 'Soft-focus finish'], 'Tap off excess and press or sweep lightly over the T-zone and under the eyes.'],
  'Setting Spray': ['A fine mist that melds layers of makeup together and helps the look last.', ['Water', 'Alcohol Denat.', 'Glycerin', 'PVP', 'Aloe Barbadensis Leaf Extract'], ['Locks in makeup', 'Reduces powdery look', 'Quick-drying mist'], 'Close your eyes, hold at arm\'s length and mist in an X and T pattern. Let it dry.'],
  Blush: ['A flush of colour for the cheeks that blends easily and can be built up from sheer to bold.', ['Talc', 'Mica', 'Dimethicone', 'Zinc Stearate', 'Iron Oxides'], ['Natural-looking flush', 'Blendable', 'Buildable payoff'], 'Smile and apply to the apples of the cheeks, blending up toward the temples.'],
  Highlighter: ['A light-catching highlighter for cheekbones, brow bones and the bridge of the nose.', ['Mica', 'Talc', 'Dimethicone', 'Silica', 'Titanium Dioxide'], ['Adds a glow', 'Smooth application', 'Layerable'], 'Sweep onto the high points of the face with a fan brush or fingertip.'],
  Contour: ['A sculpting product for adding shadow and definition under the cheekbones and along the jaw.', ['Talc', 'Mica', 'Dimethicone', 'Zinc Stearate', 'Iron Oxides'], ['Defines facial structure', 'Blends without streaks', 'Matte finish'], 'Apply under the cheekbones and along the hairline, then blend well.'],
  Eyeshadow: ['A set of eyeshadows with shades for day looks and smoky evening eyes.', ['Talc', 'Mica', 'Dimethicone', 'Magnesium Stearate', 'Iron Oxides'], ['Pigmented shades', 'Blends easily', 'Mix of mattes and shimmers'], 'Apply a base shade on the lid with a flat brush, deepen the crease and blend.'],
  Eyeliner: ['A precise liner for defining the lash line, from a thin line to a bold wing.', ['Isododecane', 'Silica', 'Synthetic Wax', 'Iron Oxides', 'Tocopherol'], ['Precise line', 'Long-wearing', 'Smudge-resistant once set'], 'Draw along the upper lash line starting from the inner corner. Let it dry before blinking.'],
  Mascara: ['A lash-lengthening mascara that separates and defines without clumping.', ['Water', 'Beeswax', 'Carnauba Wax', 'Panthenol', 'Iron Oxides'], ['Adds length and volume', 'Defined lashes', 'Flake-resistant'], 'Wiggle the wand at the lash base and sweep upward. Repeat for more volume.'],
  'Eyebrow Pencil': ['A fine-tip brow pencil for filling in sparse areas with hair-like strokes.', ['Hydrogenated Vegetable Oil', 'Candelilla Wax', 'Talc', 'Iron Oxides'], ['Fills sparse brows', 'Natural hair-like strokes', 'Defined shape'], 'Use short, light strokes following the direction of hair growth, then brush through.'],
  Kajal: ['A creamy kajal that glides over the waterline and lash line with deep colour.', ['Hydrogenated Castor Oil', 'Candelilla Wax', 'Carbon Black', 'Vitamin E'], ['Intense colour', 'Smooth glide', 'Suitable for waterline'], 'Line the upper and lower waterline or smudge along the lash line for a smoky effect.'],
  Lipstick: ['A lipstick with rich colour and a comfortable finish for everyday and occasion wear.', ['Ricinus Communis Seed Oil', 'Candelilla Wax', 'Octyldodecanol', 'Mica', 'Tocopheryl Acetate'], ['Rich colour payoff', 'Comfortable to wear', 'Defined edges'], 'Apply from the centre of the lips outward, then blot and reapply for more intensity.'],
  'Lip Gloss': ['A glossy lip product for shine and a cushiony feel, worn alone or over lipstick.', ['Polybutene', 'Hydrogenated Polyisobutene', 'Vitamin E', 'Mica'], ['High shine', 'Soft cushiony feel', 'Non-sticky wear'], 'Apply directly from the applicator to bare lips or over lip colour.'],
  'Lip Liner': ['A lip pencil for shaping, defining and helping lip colour stay in place.', ['Hydrogenated Polydecene', 'Candelilla Wax', 'Mica', 'Iron Oxides'], ['Defines lip shape', 'Helps colour last', 'Creamy glide'], 'Outline the lips, then fill in the whole lip for a long-lasting base.'],
  'Lip Tint': ['A lightweight tint that gives a sheer wash of colour with a natural finish.', ['Water', 'Glycerin', 'Castor Oil', 'Red 28 Lake', 'Tocopherol'], ['Natural-looking colour', 'Lightweight feel', 'Easy to layer'], 'Dab onto lips and blend with a fingertip. Layer for deeper colour.'],
  'Liquid Lipstick': ['A liquid lipstick that dries to a matte finish with high-impact colour.', ['Isododecane', 'Trimethylsiloxysilicate', 'Silica', 'Iron Oxides', 'Tocopherol'], ['Matte finish', 'Intense colour', 'Long-lasting wear'], 'Outline and fill in the lips with the applicator. Let it set for a minute without pressing lips together.'],
  'Makeup Brushes': ['A soft, dense brush designed for even makeup application with minimal streaking.', ['Synthetic bristles', 'Aluminium ferrule', 'Wooden handle'], ['Even application', 'Soft on skin', 'Easy to clean'], 'Dip lightly into product and buff in circular motions. Wash with mild shampoo regularly.'],
  'Beauty Blender': ['A soft sponge for pressing and blending foundation and concealer into skin.', ['Latex-free foam'], ['Seamless blending', 'Bouncy texture', 'Works with liquids and creams'], 'Dampen, squeeze out water, then bounce over the face to blend product.'],
  'Makeup Sponge': ['A wedge-shaped sponge for blending base products and getting into corners of the face.', ['Latex-free foam'], ['Smooth finish', 'Precise blending', 'Gentle on skin'], 'Use dry for fuller coverage or damp for a sheerer finish. Clean after use.'],
  'Eyelash Curler': ['A curler that lifts lashes for an open-eyed look, with a comfortable pad.', ['Stainless steel frame', 'Silicone pad'], ['Lifts and curls lashes', 'Comfortable grip', 'Opens up eyes'], 'Clamp at the base of lashes, hold a few seconds, then move up and repeat before mascara.'],
  Cleanser: ['A gentle cleanser that lifts away dirt and makeup and leaves skin feeling soft.', ['Water', 'Glycerin', 'Caprylic/Capric Triglyceride', 'Tocopherol'], ['Removes makeup and dirt', 'Leaves skin comfortable', 'Gentle on skin'], 'Massage onto dry skin, add a little water to emulsify, then rinse.'],
  Moisturizer: ['A daily moisturiser that keeps skin hydrated and ready for makeup.', ['Water', 'Glycerin', 'Squalane', 'Hyaluronic Acid', 'Ceramide NP'], ['Hydrates', 'Smooth skin surface', 'Good base for makeup'], 'Apply to clean skin morning and night.'],
  'Face Serum': ['A concentrated serum for night-time care that supports skin\'s look and feel.', ['Water', 'Glycerin', 'Hyaluronic Acid', 'Peptides', 'Panthenol'], ['Supports a smoother look', 'Lightweight texture', 'Layers well'], 'Smooth a few drops over the face and neck before moisturiser.'],
  'Makeup Remover': ['A no-rinse remover that dissolves makeup including waterproof formulas.', ['Water', 'Hexylene Glycol', 'Glycerin', 'Poloxamer 184'], ['Removes makeup quickly', 'No rubbing needed', 'Suitable for sensitive skin'], 'Soak a cotton pad, hold over eyes for a few seconds and wipe gently.'],
};

const BG = { Face: ['F1D9D3', '5A2B3A'], Eyes: ['E3D6DD', '4B2E3F'], Lips: ['EBC5C0', '7B2A4D'], Cheeks: ['F4D3CB', '8A3F4E'], Skincare: ['E7ECE4', '3E5A4B'], 'Brushes & Tools': ['EADFD2', '5B4636'] };

// [name, brand, category, price (INR), original price, rating, reviews, stock, shades]
const P = [
  ['Fit Me Matte + Poreless Foundation', 'Maybelline', 'Foundation', 499, 599, 4.4, 2150, 60, 'foundation'],
  ['Infallible 32H Matte Cover Foundation', "L'Oréal Paris", 'Foundation', 899, 1099, 4.3, 1380, 45, 'foundation'],
  ["Pro Filt'r Soft Matte Longwear Foundation", 'Fenty Beauty', 'Foundation', 3400, 3400, 4.6, 980, 25, 'foundation'],
  ['Hydrating Foundation', 'Kay Beauty', 'Foundation', 1099, 1299, 4.2, 640, 40, 'foundation'],
  ['Double Wear Stay-in-Place Foundation', 'Estée Lauder', 'Foundation', 4500, 4500, 4.7, 1500, 18, 'foundation'],
  ['Radiant Creamy Concealer', 'NARS', 'Concealer', 2600, 2600, 4.6, 870, 30, 'concealer'],
  ['Instant Age Rewind Concealer', 'Maybelline', 'Concealer', 599, 699, 4.3, 1900, 70, 'concealer'],
  ['Easy Bake Loose Setting Powder', 'Huda Beauty', 'Setting Powder', 2800, 2800, 4.5, 760, 22, 'powder'],
  ['Power Grip Primer', 'e.l.f.', 'Primer', 1150, 1350, 4.5, 2400, 55, null],
  ['Poreless Smoothing Primer', 'Sephora Collection', 'Primer', 1290, 1490, 4.1, 410, 35, null],
  ['Matte Finish Setting Spray', 'NYX Professional Makeup', 'Setting Spray', 899, 1099, 4.4, 3100, 80, null],
  ['Prep + Prime Fix+ Setting Mist', 'MAC', 'Setting Spray', 2400, 2400, 4.6, 1200, 35, null],
  ['Soft Pinch Liquid Blush', 'Rare Beauty', 'Blush', 2300, 2300, 4.7, 3400, 40, 'blush'],
  ['Powder Blush', 'NARS', 'Blush', 2900, 2900, 4.6, 1250, 28, 'blush'],
  ['Blush Blush Face Powder', 'SUGAR Cosmetics', 'Blush', 799, 999, 4.2, 530, 50, 'blush'],
  ['Killawatt Freestyle Highlighter', 'Fenty Beauty', 'Highlighter', 3300, 3300, 4.6, 1100, 20, 'highlighter'],
  ['Glow Drops Illuminating Highlighter', 'Aurelle', 'Highlighter', 699, 899, 4.0, 220, 45, 'highlighter'],
  ['Facestudio Master Contour Kit', 'Maybelline', 'Contour', 849, 999, 4.1, 760, 38, 'contour'],
  ['Wonder Stick Highlight & Contour', 'NYX Professional Makeup', 'Contour', 1099, 1299, 4.3, 890, 42, 'contour'],
  ['Obsessions Eyeshadow Palette', 'Huda Beauty', 'Eyeshadow', 2700, 2700, 4.7, 2100, 26, 'shadow'],
  ['Blend The Rules Eyeshadow Palette', 'SUGAR Cosmetics', 'Eyeshadow', 999, 1199, 4.2, 480, 33, 'shadow'],
  ['Super Liner Perfect Slim', "L'Oréal Paris", 'Eyeliner', 549, 649, 4.2, 1450, 65, 'liner'],
  ['Epic Wear Liner Stick', 'NYX Professional Makeup', 'Eyeliner', 899, 999, 4.5, 1700, 48, 'liner'],
  ['Lash Sensational Mascara', 'Maybelline', 'Mascara', 699, 799, 4.5, 3900, 90, 'mascara'],
  ['Voluminous Lash Paradise Mascara', "L'Oréal Paris", 'Mascara', 799, 999, 4.4, 2750, 75, 'mascara'],
  ['Micro Brow Pencil', 'NYX Professional Makeup', 'Eyebrow Pencil', 899, 999, 4.5, 2300, 52, 'brow'],
  ['Eyeconic Kajal', 'Lakmé', 'Kajal', 225, 250, 4.4, 5200, 120, 'liner'],
  ['Kohl Of Honour Intense Kajal', 'SUGAR Cosmetics', 'Kajal', 349, 399, 4.3, 1900, 85, 'liner'],
  ['Matte Lipstick', 'MAC', 'Lipstick', 1950, 1950, 4.7, 4800, 60, 'lip'],
  ['Matte Revolution Lipstick', 'Charlotte Tilbury', 'Lipstick', 3300, 3300, 4.6, 1650, 24, 'lip'],
  ['9 to 5 Primer + Matte Lipstick', 'Lakmé', 'Lipstick', 450, 550, 4.3, 3300, 95, 'lip'],
  ['Butter Gloss', 'NYX Professional Makeup', 'Lip Gloss', 599, 699, 4.6, 4100, 110, 'gloss'],
  ['Gloss Bomb Universal Lip Luminizer', 'Fenty Beauty', 'Lip Gloss', 2200, 2200, 4.6, 2600, 30, 'gloss'],
  ['Lip Pencil', 'MAC', 'Lip Liner', 1700, 1700, 4.5, 1300, 44, 'lip'],
  ['Slim Lip Pencil', 'NYX Professional Makeup', 'Lip Liner', 449, 499, 4.4, 2800, 100, 'lip'],
  ['Soft Pinch Tinted Lip Oil', 'Rare Beauty', 'Lip Tint', 1900, 1900, 4.5, 1100, 36, 'gloss'],
  ['Cream Lip Stain', 'Sephora Collection', 'Lip Tint', 950, 1150, 4.0, 520, 40, 'lip'],
  ['Smudge Me Not Liquid Lipstick', 'SUGAR Cosmetics', 'Liquid Lipstick', 499, 599, 4.3, 4400, 130, 'lip'],
  ['Colour Block Liquid Lipstick', 'Colorbar', 'Liquid Lipstick', 599, 749, 4.1, 870, 58, 'lip'],
  ['Classic Foundation Brush', 'Sephora Collection', 'Makeup Brushes', 1490, 1690, 4.4, 640, 30, null],
  ['Original Beautyblender', 'Beautyblender', 'Beauty Blender', 1600, 1600, 4.6, 2200, 45, null],
  ['Total Face Makeup Sponge', 'Aurelle', 'Makeup Sponge', 249, 299, 4.1, 360, 150, null],
  ['Precision Eyelash Curler', 'Aurelle', 'Eyelash Curler', 399, 499, 4.2, 440, 70, null],
  ['Take The Day Off Cleansing Balm', 'Clinique', 'Cleanser', 2800, 2800, 4.6, 1800, 32, null],
  ['Dramatically Different Moisturizing Lotion+', 'Clinique', 'Moisturizer', 2400, 2400, 4.5, 2100, 3, null],
  ['Advanced Night Repair Serum', 'Estée Lauder', 'Face Serum', 6900, 6900, 4.7, 2900, 15, null],
  ['Micellar Water Makeup Remover', "L'Oréal Paris", 'Makeup Remover', 399, 499, 4.5, 6100, 140, null],
];

const PRODUCT_IMAGES = {
  'Maybelline - Fit Me Matte + Poreless Foundation': [
    '/products/maybelline-fit-me-generated.png'
  ]
};

const makeCategoryImage = (kind) => {
  const designs = {
    foundation: `
      <rect x="170" y="125" width="140" height="220" rx="24" fill="#D6A47A"/>
      <rect x="190" y="90" width="100" height="40" rx="8" fill="#5A2B3A"/>
      <rect x="220" y="65" width="40" height="30" rx="5" fill="#5A2B3A"/>
    `,
    concealer: `
      <rect x="190" y="120" width="100" height="220" rx="18" fill="#C99573"/>
      <rect x="210" y="80" width="60" height="45" rx="8" fill="#5A2B3A"/>
      <line x1="240" y1="80" x2="240" y2="50" stroke="#5A2B3A" stroke-width="12"/>
    `,
    primer: `
      <rect x="180" y="120" width="120" height="230" rx="30" fill="#E8C7B8"/>
      <rect x="205" y="85" width="70" height="45" rx="8" fill="#5A2B3A"/>
    `,
    powder: `
      <circle cx="240" cy="235" r="105" fill="#E5C7B9"/>
      <circle cx="240" cy="235" r="78" fill="#F4DED5"/>
      <circle cx="240" cy="235" r="48" fill="#D9B09D"/>
    `,
    cheeks: `
      <circle cx="240" cy="235" r="105" fill="#D8898B"/>
      <circle cx="240" cy="235" r="78" fill="#E9A5A0"/>
      <circle cx="240" cy="235" r="45" fill="#F1C1B7"/>
    `,
    eyes: `
      <rect x="115" y="135" width="250" height="180" rx="24" fill="#C9A79B"/>
      <circle cx="165" cy="185" r="25" fill="#8B5E4B"/>
      <circle cx="240" cy="185" r="25" fill="#D49A75"/>
      <circle cx="315" cy="185" r="25" fill="#6B4050"/>
      <circle cx="165" cy="255" r="25" fill="#E2BFA5"/>
      <circle cx="240" cy="255" r="25" fill="#A87560"/>
      <circle cx="315" cy="255" r="25" fill="#5A2B3A"/>
    `,
    mascara: `
  <rect x="195" y="175" width="90" height="155" rx="18" fill="#292329"/>
  <rect x="205" y="135" width="70" height="45" rx="8" fill="#5A2B3A"/>
  <rect x="225" y="95" width="30" height="45" rx="5" fill="#292329"/>
  <path d="M225 95 L215 60" stroke="#222" stroke-width="8"/>
  <path d="M255 95 L265 60" stroke="#222" stroke-width="8"/>
  <ellipse cx="240" cy="330" rx="48" ry="8" fill="#5A2B3A" opacity=".2"/>
`,
    lipstick: `
      <rect x="185" y="185" width="110" height="150" rx="12" fill="#5A2B3A"/>
      <rect x="205" y="120" width="70" height="80" fill="#D46A76"/>
      <path d="M205 120 L220 80 L275 80 L275 120 Z" fill="#B94D5C"/>
    `,
    lip: `
  <rect x="195" y="155" width="90" height="175" rx="28" fill="#D96F83"/>
  <rect x="205" y="125" width="70" height="45" rx="10" fill="#5A2B3A"/>
  <rect x="215" y="95" width="50" height="35" rx="8" fill="#3F2430"/>
  <ellipse cx="240" cy="330" rx="45" ry="8" fill="#8C4A5A" opacity=".25"/>
`,
    pencil: `
      <polygon points="215,330 265,330 260,115 220,115" fill="#5A2B3A"/>
      <polygon points="220,115 260,115 240,70" fill="#D8A27C"/>
    `,
    brow: `
  <polygon points="215,330 265,330 258,95 222,95" fill="#6B493F"/>
  <polygon points="222,95 258,95 240,55" fill="#3F2925"/>
  <rect x="218" y="175" width="44" height="18" rx="5" fill="#9A7769"/>
`,
kajal: `
  <polygon points="215,335 265,335 258,95 222,95" fill="#242024"/>
  <polygon points="222,95 258,95 240,55" fill="#111"/>
  <rect x="215" y="300" width="50" height="28" rx="6" fill="#5A2B3A"/>
`,
liner: `
  <polygon points="218,335 262,335 258,85 222,85" fill="#343036"/>
  <polygon points="222,85 258,85 240,48" fill="#17141A"/>
  <rect x="215" y="175" width="50" height="18" rx="5" fill="#5A2B3A"/>
`,
lipliner: `
  <polygon points="220,340 260,340 255,95 225,95" fill="#A85F62"/>
  <polygon points="225,95 255,95 240,50" fill="#8A3F49"/>
  <rect x="218" y="205" width="44" height="20" rx="5" fill="#5A2B3A"/>
`,
luminizer: `
  <rect x="190" y="135" width="100" height="205" rx="22" fill="#E7B7A8"/>
  <rect x="205" y="100" width="70" height="40" rx="8" fill="#C9A27F"/>
  <rect x="215" y="70" width="50" height="35" rx="8" fill="#5A2B3A"/>
  <circle cx="240" cy="230" r="38" fill="#F8DDD2" opacity=".75"/>
`,
brush: `
  <rect x="230" y="145" width="20" height="210" rx="10" fill="#8A604F"/>
  <path d="M195 150 Q240 55 285 150 Z" fill="#C7AAA0"/>
  <path d="M205 145 Q240 80 275 145" fill="none" stroke="#A88C83" stroke-width="5"/>
  <ellipse cx="240" cy="360" rx="45" ry="8" fill="#5A2B3A" opacity=".2"/>
`,
liquidlip: `
  <rect x="190" y="150" width="100" height="190" rx="18" fill="#D46A76"/>
  <rect x="205" y="105" width="70" height="50" rx="8" fill="#5A2B3A"/>
  <rect x="215" y="70" width="50" height="40" rx="8" fill="#292329"/>
  <line x1="240" y1="70" x2="240" y2="45" stroke="#5A2B3A" stroke-width="7"/>
`,
primer: `
  <path d="M185 145 Q185 120 210 120 L270 120 Q295 120 295 145 L285 335 L195 335 Z"
        fill="#E4C4B7"/>
  <rect x="205" y="85" width="70" height="45" rx="8" fill="#5A2B3A"/>
  <rect x="220" y="65" width="40" height="25" rx="5" fill="#3F2430"/>
`,

    spray: `
      <rect x="175" y="125" width="130" height="220" rx="24" fill="#C8D8D1"/>
      <rect x="195" y="90" width="90" height="45" rx="8" fill="#5A2B3A"/>
      <rect x="250" y="65" width="65" height="25" rx="8" fill="#5A2B3A"/>
    `,
    brush: `
      <rect x="230" y="135" width="20" height="220" rx="10" fill="#8A604F"/>
      <path d="M190 140 Q240 55 290 140 Z" fill="#D6B7A8"/>
    `,
    sponge: `
      <path d="M240 80
               C300 80 335 130 320 190
               C350 260 310 335 240 345
               C170 335 130 260 160 190
               C145 130 180 80 240 80 Z"
            fill="#E7A6A5"/>
    `,
    skincare: `
      <rect x="175" y="125" width="130" height="220" rx="25" fill="#D7E4DE"/>
      <rect x="200" y="90" width="80" height="45" rx="8" fill="#5A2B3A"/>
      <rect x="225" y="65" width="30" height="30" rx="5" fill="#5A2B3A"/>
    `,
    curler: `
      <path d="M175 150 Q240 90 305 150" fill="none" stroke="#B8A29B" stroke-width="25"/>
      <path d="M190 150 L160 335" stroke="#8C7770" stroke-width="20"/>
      <path d="M290 150 L320 335" stroke="#8C7770" stroke-width="20"/>
    `
  };

  const art = designs[kind] || designs.foundation;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FFF7F3"/>
          <stop offset="100%" stop-color="#F1D9D3"/>
        </linearGradient>
      </defs>

      <rect width="480" height="480" rx="32" fill="url(#bg)"/>

      <ellipse
        cx="240"
        cy="380"
        rx="125"
        ry="20"
        fill="#5A2B3A"
        opacity=".12"
      />

      ${art}

      <text
        x="240"
        y="425"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="18"
        font-weight="bold"
        fill="#5A2B3A"
      >
        VELLORA
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const getImageKind = (label) => {
  const text = label.toLowerCase();

  if (/setting spray|setting mist/.test(text)) return 'spray';

  if (/eyeshadow|palette/.test(text)) return 'eyes';

  if (/mascara/.test(text)) return 'mascara';

  if (/eyebrow|brow pencil|brow/.test(text)) return 'brow';

  if (/kajal/.test(text)) return 'kajal';

  if (/eyeliner|liner stick/.test(text)) return 'liner';

  if (/lip luminizer|lip highlighter/.test(text)) return 'luminizer';

  if (/lip liner|lip pencil/.test(text)) return 'lipliner';

  if (/liquid lipstick/.test(text)) return 'liquidlip';

  if (/lip gloss|gloss|lip tint|lip stain|lip oil/.test(text)) return 'lip';

  if (/lipstick/.test(text)) return 'lipstick';

  if (/blush|highlighter|contour/.test(text)) return 'cheeks';

  if (/powder/.test(text)) return 'powder';

  if (/concealer/.test(text)) return 'concealer';

  if (/primer/.test(text)) return 'primer';

  if (/foundation/.test(text)) return 'foundation';

  if (/foundation brush|makeup brush|brush/.test(text)) return 'brush';

  if (/beautyblender|sponge/.test(text)) return 'sponge';

  if (/eyelash curler|curler/.test(text)) return 'curler';

  if (/cleanser|cleansing|moisturizer|moisturizing|serum|remover|micellar/.test(text)) {
    return 'skincare';
  }

  return 'foundation';
};

const imgUrl = (group, label, variant = 0, category = '') => {
  const images = PRODUCT_IMAGES[label];

  // Keep the real Maybelline image
  if (images && images[variant]) {
    return images[variant];
  }

  const categoryMap = {
    'Foundation': 'foundation',
    'Concealer': 'concealer',
    'Setting Powder': 'powder',
    'Primer': 'primer',
    'Setting Spray': 'spray',

    'Blush': 'cheeks',
    'Highlighter': 'cheeks',
    'Contour': 'cheeks',

    'Eyeshadow': 'eyes',
    'Eyeliner': 'liner',
    'Mascara': 'mascara',
    'Eyebrow Pencil': 'brow',
    'Kajal': 'kajal',

    'Lipstick': 'lipstick',
    'Lip Gloss': 'lip',
    'Lip Liner': 'lipliner',
    'Lip Tint': 'lip',
    'Liquid Lipstick': 'liquidlip',

    'Makeup Brushes': 'brush',
    'Beauty Blender': 'sponge',
    'Makeup Sponge': 'sponge',
    'Eyelash Curler': 'curler',

    'Cleanser': 'skincare',
    'Moisturizer': 'skincare',
    'Face Serum': 'skincare',
    'Makeup Remover': 'skincare'
  };

  const kind = categoryMap[category] || 'foundation';

  return makeCategoryImage(kind);
};

function buildProduct([name, brand, category, price, originalPrice, rating, reviewCount, stock, shadeKey]) {
  const group = groupOf(category);
  const [desc, ingredients, benefits, howToUse] = T[category];
  const label = `${brand}\n${name}`.replace(/\n/g, ' - ');
  return {
    name,
    brand,
    category,
    description: `${name} by ${brand}. ${desc}`,
    price,
    originalPrice,
    stock,
    rating,
    reviewCount,
    image: imgUrl(group, label, 0, category),
    images: [imgUrl(group, label, 0, category)],
    ingredients,
    benefits,
    howToUse,
    shades: shadeKey ? S[shadeKey].map(([n, hex]) => ({ name: n, hex })) : [],
  };
}

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing. Create server/.env first.');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  console.log('Connected. Clearing old data...');
  await Promise.all([Product.deleteMany({}), User.deleteMany({}), Order.deleteMany({})]);

  // Demo credentials (NOT for production)
  await User.create({ name: 'Store Admin', email: 'admin@beautystore.com', password: 'Admin@123', role: 'admin', phone: '9000000001' });
  await User.create({ name: 'Demo Customer', email: 'user@beautystore.com', password: 'User@123', role: 'user', phone: '9000000002' });

  const docs = P.map(buildProduct);
  for (const d of docs) await Product.create(d); // create() so validators + hooks run
  console.log(`Seeded ${docs.length} products and 2 demo users.`);
  console.log('Admin: admin@beautystore.com / Admin@123');
  console.log('User:  user@beautystore.com / User@123');
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('Seed failed:', err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
