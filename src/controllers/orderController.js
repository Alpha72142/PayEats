const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

exports.createOrder = async (req, res) => {
    const userId = req.user.id; // Get user ID from the request
    const { deliveryAddress } = req.body; // Accept delivery address from the request

    // Validate input
    if (!userId || !deliveryAddress) {
        return res.status(400).json({ message: 'User ID and delivery address are required' });
    }

    try {
        // Fetch user's cart items
        const cartItems = await Cart.getCartByUserId(userId);
        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        // Create the order first
        const newOrder = await Order.addOrder(userId, calculateTotalPrice(cartItems), deliveryAddress);
        
        // Add items to the order
        for (const item of cartItems) {
            await Order.addOrderItem(newOrder.id, item.itemId, item.name, item.image, item.quantity);
        }

        // Optionally, clear the cart after creating the order
        // await Cart.clearCart(userId); // Uncomment if needed

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

exports.getOrderDetails = async (req, res) => {
    const { orderId } = req.params;
    try {
        const orderDetails = await Order.getOrderDetails(orderId);
        if (!orderDetails) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(orderDetails);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.scanItemInOrder = async (req, res) => {
    const { orderId } = req.params;
    const { itemName } = req.body; // Scanned item's name

    try {
        // Check if the order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the item exists in the order
        const itemIndex = order.items.findIndex(item => item.name === itemName);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in the order' });
        }

        // Update item status to delivered
        order.items[itemIndex].status = 'Delivered'; // Assuming 'Delivered' is the status you want to use

        // Save the updated order
        await order.save();

        res.status(200).json({ message: `Item ${itemName} marked as delivered in the order`, order });
    } catch (error) {
        console.error('Error scanning item in order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params; // Get the order ID from the request parameters
    const { status } = req.body; // Get the new status from the request body

    // Validate input
    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    try {
        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order status
        order.status = status; // Update the status of the order
        await order.save(); // Save the updated order

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
