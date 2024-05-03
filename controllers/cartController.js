const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Cart = require('../model/cartModel');
const Product = require('../model/productModel');
const factory = require('../controllers/handlerFactory');

exports.addToCart = catchAsync(async (req, res, next) => {
  const quantity = req.body.quantity;
  const productID = req.params.productID;
  // Check if the product exists
  const product = await Product.findById(productID);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  // Compare Stock and quantity
  if (product.stock < quantity) {
    return next(
      new AppError(`We only have ${product.stock} items of this Product`, 404)
    );
  }
  // Check if the user already has a cart
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    // If the cart doesn't exist for the user, create a new cart
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  // Check if the product is already in the cart
  const cartItemIndex = cart.items.findIndex(item =>
    item.product.equals(productID)
  );

  if (cartItemIndex !== -1) {
    // If the product is already in the cart, update its quantity
    if (cart.items[cartItemIndex].quantity + quantity > product.stock) {
      return next(
        new AppError(
          `You can only add ${product.stock -
            cart.items[cartItemIndex]
              .quantity} items of this Product to your cart`,
          404
        )
      );
    }
    cart.items[cartItemIndex].quantity += quantity;
  } else {
    // If the product is not in the cart, add it as a new item
    cart.items.push({ product: productID, quantity });
  }

  // Save the cart to the database
  await cart.save();

  res.status(201).json({
    status: 'success',
    message: 'Items added to cart successfully',
    cart
  });
});
exports.RemoveCartItem = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { itemId } = req.body;

  // Find the user's cart
  const cart = await Cart.findOne({ user: userId });

  // Find the index of the item in the cart
  const itemIndex = cart.items.findIndex(item => item._id.equals(itemId));

  if (itemIndex === -1) {
    return next(new AppError('Item not found on your cart!', 404));
  }

  // Remove the item from the cart
  cart.items.splice(itemIndex, 1);

  // Save the updated cart
  await cart.save();

  res.status(201).json({
    status: 'success',
    message: 'Items removed from your cart successfully',
    cart
  });
});
exports.getCurrentUserCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.find({ user: req.user.id }).select('-user');
  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  });
});
exports.getUsersCarts = catchAsync(async (req, res, next) => {
  let cart;
  if (req.params.userID) cart = await Cart.find({ user: req.params.userID });
  else cart = await Cart.find();
  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  });
});
exports.updateCartItem = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { itemID } = req.params;
  const { quantity } = req.body;

  // Find the user's cart
  const cart = await Cart.findOne({ user: userId });
  const itemIndex = cart.items.findIndex(item => item._id.equals(itemID));
  if (itemIndex === -1) {
    return next(new AppError('Item not found on your cart!', 404));
  }
  // Update the quantity of the item
  cart.items[itemIndex].quantity = quantity;
  // Save the updated cart
  await cart.save();

  res.status(201).json({
    status: 'success',
    message: 'Item quntity updated successfully',
    cart
  });
});
exports.dropCart = factory.deleteOne(Cart, true);
