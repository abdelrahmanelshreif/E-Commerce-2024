const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Cart = require('../model/cartModel');
const Order = require('../model/orderModel');
const User = require('../model/userModel');

exports.addOrder = catchAsync(async (req, res, next) => {
  const { name, phoneNumber, email, paymentMethod, coupon } = req.body;
  const userId = req.user._id;
  const user = await User.findById(userId);
  const cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (!cart) {
    return next(new AppError('No cart found', 400));
  }

  let subTotal = 0;
  cart.items.forEach(item => {
    subTotal += item.product.currentPrice * item.quantity;
  });
  let shippingFee = 0;
  switch (user.address.region) {
    case 'Cairo':
      shippingFee = 50;
      break;
    case 'Governerates':
      shippingFee = 70;
      break;
    default:
      throw new AppError('Invalid region provided', 400);
  }
  const orderData = {
    user: userId,
    paymentMethod,
    products: cart.items.map(item => item.product),
    subTotal,
    shippingFee: shippingFee,
    userDeliveringData: {
      name,
      phoneNumber,
      email
    }
  };

  const order = await Order.create(orderData);

  await Cart.findOneAndUpdate(
    { user: userId },
    {
      $unset: {
        items: ''
      }
    },
    { new: true } // This option returns the modified document
  );

  res.status(201).json({
    status: 'success',
    message: 'Order created successfully',
    order
  });
});
