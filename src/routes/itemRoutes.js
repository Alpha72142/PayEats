const express = require('express');
const {
    getItems,
    updateItemStatus,
    addItem,
    deleteItem,
} = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getItems); // Get all items
router.post('/', authMiddleware, addItem); // Add new item
router.put('/status', authMiddleware, updateItemStatus); // Update item status
router.delete('/:itemId', authMiddleware, deleteItem); // Delete item

module.exports = router;
