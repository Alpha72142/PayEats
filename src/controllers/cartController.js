const Cart = require('../models/cartModel');

exports.viewCart = async (req, res) => {
    const userId = req.user.id; // Assuming the user is authenticated
    try {
        const cart = await Cart.getCartByUserId(userId);
        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addToCart = async (req, res) => {
    const userId = req.user.id; // Assuming the user is authenticated
    const { itemId, quantity } = req.body;
    try {
        await Cart.addItemToCart(userId, itemId, quantity);
        res.status(201).json({ message: 'Item added to cart successfully' });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateCart = async (req, res) => {
    const userId = req.user.id; // Get user ID from authenticated user
    const itemId = req.params.itemId; // Get item ID from URL parameters
    const { quantity } = req.body; // Get quantity from request body

    try {
        const result = await Cart.updateCartItem(userId, itemId, quantity);
        if (result) {
            res.status(200).json({ message: 'Cart updated successfully' });
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



exports.removeFromCart = async (req, res) => {
    const userId = req.user.id; // Assuming the user is authenticated
    const { itemId } = req.params; // Use req.params for itemId
    try {
        await Cart.removeCartItem(userId, itemId);
        res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
