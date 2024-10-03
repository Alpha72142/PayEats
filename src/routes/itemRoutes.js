const express = require('express');
const {
    getItems,
    getItemById,
    updateItemStatus,
    addItem,
    deleteItem,
} = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getItems); // Get all items
router.get('/:itemId', authMiddleware, getItemById); // Get item by ID
router.post('/', authMiddleware, addItem); // Add new item
router.put('/status', authMiddleware, updateItemStatus); // Update item status
router.delete('/:itemId', authMiddleware, deleteItem); // Delete item by Id

module.exports = router;
