const express = require('express');
const {
    addToCart,
    viewCart,
    updateCart,
    removeFromCart
} = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, addToCart); // Add item to cart
router.get('/', authMiddleware, viewCart); // View cart
router.put('/cart/:itemId', authMiddleware, updateCart);
router.delete('/cart/:itemId', authMiddleware, removeFromCart); // Remove item from cart

module.exports = router;
