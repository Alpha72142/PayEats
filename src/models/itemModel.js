const pool = require('../config/db');

const Item = {
    getAllItems: async () => {
        const result = await pool.query('SELECT * FROM items');
        return result.rows;
    },
    updateItemStatus: async (itemId, status) => {
        await pool.query('UPDATE items SET status = $1 WHERE id = $2', [status, itemId]);
    },
    addItem: async (name) => {
        const result = await pool.query('INSERT INTO items (name, status, selection) VALUES ($1, TRUE, FALSE) RETURNING *', [name]);
        return result.rows[0];
    },
    deleteItem: async (itemId) => {
        await pool.query('DELETE FROM items WHERE id = $1', [itemId]);
    },
};

module.exports = Item;
