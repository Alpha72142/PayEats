const express = require('express');
const {
    createOrder,
    scanItem
} = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new order
router.post('/', authMiddleware, createOrder); // Create new order

// Update item status after scanning
router.put('/scan', authMiddleware, scanItem); // Scan an item in an order

module.exports = router;
