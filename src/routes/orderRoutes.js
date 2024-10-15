const express = require('express');
const {
    createOrder,
    getOrderDetails,
    scanItemInOrder
} = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createOrder); // Create a new order
router.get('/:orderId', authMiddleware, getOrderDetails); // View a specific order
router.put('/:orderId/scan', authMiddleware, scanItemInOrder); // Scan item in an order to mark it delivered

module.exports = router;
