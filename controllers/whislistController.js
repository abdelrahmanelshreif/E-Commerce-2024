const Whishlist = require('../model/whishlistModel');
const Wishlist = require('../model/whishlistModel'); 
const Product = require('../model/productModel');


exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const wishlistOwner = req.user._id; // Assuming user ID is stored in req.user

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ wishlistOwner }).populate('products.product');

    if (!wishlist) {
      wishlist = new Wishlist({ wishlistOwner, products: [{ product: productId, price: product.price, count: 1 }] });
    } else {
      // Check if the product is already in the wishlist, if so, increment its count
      const existingProductIndex = wishlist.products.findIndex(item => item.product.toString() === productId);
      if (existingProductIndex !== -1) {
        wishlist.products[existingProductIndex].count++;
      } else {
        wishlist.products.push({ product: productId, price: product.price, count: 1 });
      }
    }

    await wishlist.save();

    res.json({
      status: 'success',
      message: 'Product added successfully to your Wishlist',
      data: wishlist
    });
  } catch (error) {
    console.error('Error adding to Wishlist:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const wishlistOwner = req.user._id; // Assuming user ID is stored in req.user
    const wishlist = await Wishlist.findOne({ wishlistOwner }).populate('products.product');

    if (!wishlist) {
      return res.status(404).json({ status: 'error', message: 'Wishlist not found' });
    }

    res.json({ status: 'success', wishlist });
  } catch (error) {
    console.error('Error getting Whislist:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

exports.deleteFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlistOwner = req.user._id;

    let wishlist = await Wishlist.findOne({ wishlistOwner }).populate('products.product');

    if (!wishlist) {
      return res.status(404).json({ status: 'error', message: 'Wishlist not found' });
    }

    // Remove the product from the wishlist
    wishlist.products = wishlist.products.filter(item => !item.product._id.equals(productId));

    // Save the updated wishlist
    await wishlist.save();

    // Fetch the updated wishlist again after saving
    wishlist = await Wishlist.findOne({ wishlistOwner }).populate('products.product');

    res.json({ status: 'success', message: 'Product removed from wishlist', wishlist });
  } catch (error) {
    console.error('Error deleting from Wishlist:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
