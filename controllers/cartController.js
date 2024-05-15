const Cart = require('../model/cartModel');
const Product = require('../model/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  const cartOwner = req.user._id; // Assuming user ID is stored in req.user

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  // Find or create cart
  let cart = await Cart.findOne({ cartOwner }).populate('products.product');

  if (!cart) {
    cart = new Cart({
      cartOwner,
      products: [{ product: productId, count: 1, price: product.price }]
    });
  } else {
    const existingProductIndex = cart.products.findIndex(item =>
      item.product.equals(productId)
    );
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].count++;
    } else {
      cart.products.push({
        product: productId,
        count: 1,
        price: product.price
      });
    }
  }

  // Calculate total cart price
  cart.totalCartPrice = cart.products.reduce(
    (total, item) => total + item.price * item.count,
    0
  );

  await cart.save();

  res.json({
    status: 'success',
    message: 'Product added successfully to your cart',
    numOfCartItems: cart.products.reduce(
      (total, item) => total + item.count,
      0
    ),
    data: cart
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cartOwner = req.user._id; // Assuming user ID is stored in req.user
  const cart = await Cart.findOne({ cartOwner }).populate('products.product');

  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  res.json({ status: 'success', cart });
});

exports.deleteFromCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const cartOwner = req.user._id; // Assuming user ID is stored in req.user

  let cart = await Cart.findOne({ cartOwner }).populate('products.product');

  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  // Remove the product from the cart
  cart.products = cart.products.filter(item => !item.product.equals(productId));

  // Recalculate total cart price
  cart.totalCartPrice = cart.products.reduce(
    (total, item) => total + item.price * item.count,
    0
  );

  await cart.save();

  res.json({ status: 'success', message: 'Product removed from cart', cart });
});

exports.updateProductCount = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;
  const { count } = req.body;

  const cart = await Cart.findOne({ cartOwner: req.user.id }).populate(
    'products.product'
  );
  console.log(cart);
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  const index = cart.products.findIndex(product => product._id == productId);

  if (index === -1) {
    return next(new AppError('Product not found in cart', 404));
  }
  // Update the count of the product
  cart.products[index].count = count;

  // Recalculate total cart price
  cart.totalCartPrice = cart.products.reduce(
    (total, item) => total + item.price * item.count,
    0
  );

  await cart.save();

  return res.status(200).json({
    status: 'success',
    message: 'Product count updated successfully',
    cart
  });
});
