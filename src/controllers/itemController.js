const Item = require('../models/itemModel');


exports.getItems = async (req, res) => {
    try {
        const items = await Item.getAllItems();
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addItem = async (req, res) => {
    const { name, status } = req.body; // Ensure this matches your model
    if (typeof status !== 'boolean') {
        return res.status(400).json({ message: 'Status must be a boolean value' });
    }
    try {
        await Item.addItem(name, status); // Call the correct function
        res.status(201).json({ message: 'Item added successfully' });
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateItemStatus = async (req, res) => {
    const { itemId, status } = req.body;
    if (typeof status !== 'boolean') {
        return res.status(400).json({ message: 'Status must be a boolean value' });
    }
    try {
        await Item.updateItemStatus(itemId, status);
        res.status(200).json({ message: 'Item status updated successfully' });
    } catch (error) {
        console.error('Error updating item status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteItem = async (req, res) => {
    const { itemId } = req.params;
    try {
        await Item.deleteItem(itemId);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
