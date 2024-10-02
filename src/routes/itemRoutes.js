const express = require('express');
const { getItems, updateItemStatus, addItem, deleteItem } = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/items', authMiddleware, getItems);
router.post('/items/update', authMiddleware, updateItemStatus);
router.post('/items', authMiddleware, addItem);  // Route for adding items
router.delete('/items/:itemId', authMiddleware, deleteItem);  // Route for deleting items

module.exports = router;
