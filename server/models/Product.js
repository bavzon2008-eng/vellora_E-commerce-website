const mongoose = require('mongoose');
const { ALL_CATEGORIES, groupOf } = require('../utils/categories');

const shadeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    hex: { type: String, default: '#cccccc' },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: 150 },
    brand: { type: String, required: [true, 'Brand is required'], trim: true, maxlength: 80 },
    category: { type: String, required: [true, 'Category is required'], enum: { values: ALL_CATEGORIES, message: 'Invalid category' } },
    group: { type: String },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
    originalPrice: { type: Number, min: [0, 'Original price cannot be negative'] },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
      validate: { validator: Number.isInteger, message: 'Stock must be a whole number' },
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, min: 0, default: 0 },
    image: { type: String, default: '' },
    images: { type: [String], default: [] },
    ingredients: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    howToUse: { type: String, default: '' },
    shades: { type: [shadeSchema], default: [] },
  },
  { timestamps: true }
);

productSchema.virtual('discount').get(function () {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

productSchema.pre('validate', function (next) {
  this.group = groupOf(this.category);
  if (this.price !== undefined && (!this.originalPrice || this.originalPrice < this.price)) {
    this.originalPrice = this.price;
  }
  next();
});

productSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Product', productSchema);
