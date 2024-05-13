const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');


const orderSchema = new mongoose.Schema({
  orderID: {
    type: String,
    // required: true,
    unique: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash on delivery', 'online Paymet'],
    required: [true, 'Please specify Your payment method!']
  },
  shippingFee: {
    type: Number,
    enum: [50, 60, 70], // we have to determine based on address!!
    default: 50
  },
  coupon: {
    type: mongoose.Schema.ObjectId,
    ref: 'Coupon'
  },
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    }
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a User!']
  },
  subTotal: {
    type: Number,
    required: true,
    default: 0
  },
  userDeliveringData: {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true }
  }  
}, 
 { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

orderSchema.pre('save',(async function(next) {
  // if (!this.isNew) return next();

  const Lastorder = await this.constructor.findOne(
  {}, 
  {},
  { sort: { orderID: -1}});
  if (Lastorder) {
  this.orderID= Lastorder.orderID + 1;
  } else {
  this.orderID = 1;
  }
  next();
  })
  );

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
