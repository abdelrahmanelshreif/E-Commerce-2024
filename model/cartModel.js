const mongoose = require("mongoose");
const User = require("./userModel");
const Product = require("./productModel");

  

const cartSchema = new mongoose.Schema({
  cartOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    count: {
      type: Number,
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    price: {
      type: Number,
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now, // Set a default value to the current date/time
    required: true
  },

  updatedAt: {
    type: Date,
  },
  totalCartPrice: {
    type: Number,
  }
});

cartSchema.virtual('populatedProducts', {
  ref: 'Product',
  localField: 'products.product',
  foreignField: '_id',
  justOne: false
});

cartSchema.virtual('populatedProducts.product.brand', {
  ref: 'Brand',
  localField: 'products.product.brand',
  foreignField: '_id',
  justOne: true
});

cartSchema.virtual('populatedProducts.product.category', {
  ref: 'Category',
  localField: 'products.product.category',
  foreignField: '_id',
  justOne: true
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;



