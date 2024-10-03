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
    const { name, price, offerPrice, description, image, status } = req.body; // Ensure these match your model

    // Validate required fields
    if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' });
    }

    // Ensure offerPrice can be optional
    if (offerPrice !== undefined && typeof offerPrice !== 'number') {
        return res.status(400).json({ message: 'Offer price must be a number or omitted' });
    }

    if (typeof status !== 'boolean') {
        return res.status(400).json({ message: 'Status must be a boolean value' });
    }
    try {
        // Check if item with the same name already exists
        const existingItem = await Item.getItemByName(name);
        if (existingItem) {
            return res.status(400).json({ message: 'Item with the same name already exists' });
        }

        // Add the new item if the name doesn't exist
        const newItem = await Item.addItem(name, price, offerPrice, description, image, status);
        res.status(201).json({ message: 'Item added successfully', item: newItem });
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getItemById = async (req, res) => {
    const { itemId } = req.params;
    try {
        const item = await Item.getItemById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateItemStatus = async (req, res) => {
    const { itemId, status } = req.body;
    
    // Ensure status is a boolean
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
