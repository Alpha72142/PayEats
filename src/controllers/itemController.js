const Item = require('../models/itemModel');

exports.getItems = async (req, res) => {
    try {
        const items = await Item.getAllItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateItemStatus = async (req, res) => {
    const { itemId, status } = req.body;

    try {
        await Item.updateItemStatus(itemId, status);
        res.status(200).json({ message: 'Item status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addItem = async (req, res) => {
    const { name, status } = req.body; // Adjust based on your model's properties
    try {
        await Item.addNewItem(name, status); // Ensure this function exists in your Item model
        res.status(201).json({ message: 'Item added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteItem = async (req, res) => {
    const { itemId } = req.params;
    try {
        await Item.deleteItem(itemId); // Ensure this function exists in your Item model
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
