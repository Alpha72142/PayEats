const Order = require('../models/orderModel');

exports.createOrder = async (req, res) => {
    const { userId, items, deliveryAddress } = req.body; // Accept an array of items
    if (!userId || !items || items.length === 0) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Create the order first
        const newOrder = await Order.addOrder(userId, calculateTotalPrice(items), deliveryAddress);
        
        // Add items to the order
        for (const item of items) {
            await Order.addOrderItem(newOrder.id, item.itemId, item.itemName, item.itemImage, item.quantity);
        }

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

exports.scanItem = async (req, res) => {
    const { orderItemId, status } = req.body;

    if (!orderItemId || !status) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        await Order.updateItemStatus(orderItemId, status); // status can be 'Scanned' or 'Delivered'
        res.status(200).json({ message: 'Item status updated successfully' });
    } catch (error) {
        console.error('Error updating item status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
