const Cart = require('../model/cartModel');
const Product = require('../model/productModel');

exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const cartOwner = req.user._id; // Assuming user ID is stored in req.user

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ cartOwner }).populate('products.product');

    if (!cart) {
      cart = new Cart({ cartOwner, products: [{ product: productId, count: 1, price: product.price }] });
    } else {
      const existingProductIndex = cart.products.findIndex(item => item.product.equals(productId));
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].count++;
      } else {
        cart.products.push({ product: productId, count: 1, price: product.price });
      }
    }

    // Calculate total cart price
    cart.totalCartPrice = cart.products.reduce((total, item) => total + (item.price * item.count), 0);

    await cart.save();

    res.json({
      status: 'success',
      message: 'Product added successfully to your cart',
      numOfCartItems: cart.products.reduce((total, item) => total + item.count, 0),
      data: cart
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};   

exports.getCart = async (req, res) => {
  try {
    const cartOwner = req.user._id; // Assuming user ID is stored in req.user
    const cart = await Cart.findOne({ cartOwner }).populate('products.product');

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    res.json({ status: 'success', cart });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

exports.deleteFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cartOwner = req.user._id; // Assuming user ID is stored in req.user

    let cart = await Cart.findOne({ cartOwner }).populate('products.product');

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    // Remove the product from the cart
    cart.products = cart.products.filter(item => !item.product.equals(productId));

    // Recalculate total cart price
    cart.totalCartPrice = cart.products.reduce((total, item) => total + (item.price * item.count), 0);

    await cart.save();

    res.json({ status: 'success', message: 'Product removed from cart', cart });
  } catch (error) {
    console.error('Error deleting from cart:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};   

exports.updateProductCount = async (req, res) => {
  const productId = req.params.productId;
  const { count } = req.body;

  try {
    const cart = await Cart.findOne({ cartOwner: req.user.id }).populate('products.product');
    console.log(cart);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const index = cart.products.findIndex(product => product._id == productId);

    if (index === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Update the count of the product
    cart.products[index].count = count;

    // Recalculate total cart price
    cart.totalCartPrice = cart.products.reduce((total, item) => total + (item.price * item.count), 0);

    await cart.save();

    return res.status(200).json({ status: 'success', message: 'Product count updated successfully', cart });
  } catch (error) {
    console.error('Error updating product count:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
