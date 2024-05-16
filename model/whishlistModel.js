const mongoose = require('mongoose');
const User = require('./userModel');
const Product = require('./productModel');

const whishListSchema = new mongoose.Schema({
  wishlistOwner: {
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
    default: Date.now, 
    required: true
  },

  updatedAt: {
    type: Date,
  },
});

whishListSchema.virtual('populatedProducts', {
  ref: 'Product',
  localField: 'products.product',
  foreignField: '_id',
  justOne: false
});


const Wishlist = mongoose.model('Wishlist', whishListSchema);

module.exports = Wishlist;



