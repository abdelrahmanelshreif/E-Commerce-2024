const mongoose = require('mongoose');
const User = require('./userModel');
const Product = require('./productModel');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
  // createdAt: {
  //   type: Date
  //   //default: Date.now,
  // }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
