const Order = require('../model/orderModel');
const factory = require('../controllers/handlerFactory');
const Cart = require('../model/cartModel');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const cartId = req.params.id;
        const { shippingAddress } = req.body;

        // Ensure shippingAddress is not null or undefined
        if (!shippingAddress) {
            return res.status(400).json({ message: 'Shipping address is required' });
        }

        // Destructure shipping address fields
        const { details, phone, city } = shippingAddress;

        // Check if any of the required fields are missing
        if (!details || !phone || !city) {
            return res.status(400).json({ message: 'Address details, phone, and city are required' });
        }

        // Find the cart by ID
        const cart = await Cart.findById(cartId).populate('products.product');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Create a new order instance
        const order = new Order({
            user: cart.cartOwner,
            products: cart.products.map(item => ({
                product: item.product._id,
                count: item.count,
                price: item.price
            })),
            totalOrderPrice: cart.totalCartPrice,
            address: {
                details,
                phone,
                city
            }
        });

        // Save the order to the database
        await order.save();
        await Cart.findByIdAndDelete(cartId); 
        // Optionally, you can clear the cart after creating the order
        // await Cart.findByIdAndDelete(cartId);

        // Respond with success message and the created order
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        // Handle any errors
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.getOrders = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you have the user ID available in the request

        // Find all orders for the user
        const orders = await Order.find({ user: userId }).populate({
          path: 'products.product',
          select: 'title price imageCover -brand -category' // Specify the fields to populate
      });

        // Map the orders to a simpler format for response
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            address: order.address,
            totalOrderPrice: order.totalOrderPrice,
            createdAt: order.createdAt
        }));

        // Respond with the formatted orders
        res.status(200).json(
          { 
          status: 'success',
          orders: orders
         });
    } catch (error) {
        // Handle any errors
        console.error('Error getting orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
