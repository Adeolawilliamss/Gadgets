const mongoose = require('mongoose');

// Define an embedded Review schema
const ReviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true },
    text: { type: String, required: true },
  },
  { _id: false },
);

const ProductSchema = new mongoose.Schema({
  // A unified identifier (you might need to convert numbers to strings if mixing formats)
  productId: { type: String, required: true, unique: true },

  name: { type: String, required: true },

  collection: { type: String },

  images: { type: [String], default: [] },

  videos: { type: [String], default: [] },

  price: { type: Number },

  oldItemPrice: { type: Number },

  newItemPrice: { type: Number },

  discount: { type: String },

  badge: { type: String },

  shortDesc: { type: String },

  description: { type: String },

  // Reviews stored as an array of subdocuments
  reviews: { type: [ReviewSchema], default: [] },

  avgRating: { type: Number },

  // Additional fields that might be specific to one data set (e.g., brand, category etc.)
  brand: { type: String },
  category: { type: String },
  color: { type: String },
  OS: { type: String },
  CPU: { type: String },

  // Additional metadata for categorizing the product in your app views
  isRecentlyAdded: { type: Boolean, default: false },
  // 'feature' can be used for values like 'weekly' or any other flag you need
  feature: { type: String, default: null },

  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
