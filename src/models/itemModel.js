const pool = require('../config/db');

const Item = {
    getAllItems: async () => {
        const result = await pool.query('SELECT * FROM items');
        return result.rows;
    },
    
    getItemByName: async (name) => {
        const result = await pool.query('SELECT * FROM items WHERE name = $1', [name]);
        return result.rows[0]; // Returns the item if found, otherwise null
    },

    getItemById: async (itemId) => {
        const result = await pool.query('SELECT * FROM items WHERE id = $1', [itemId]);
        return result.rows[0];
    },
    
    updateItemStatus: async (itemId, status) => {
        await pool.query('UPDATE items SET status = $1 WHERE id = $2', [status, itemId]);
    },
    
    addItem: async (name, price, offerPrice, description, image, status) => {
        const result = await pool.query(
            'INSERT INTO items (name, price, offer_price, description, image, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, price, offerPrice, description, image, status]
        );
        return result.rows[0];
    },
    
    deleteItem: async (itemId) => {
        await pool.query('DELETE FROM items WHERE id = $1', [itemId]);
    },
};

module.exports = Item;
