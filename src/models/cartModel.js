const pool = require('../config/db');

const Cart = {
    getCartByUserId: async (userId) => {
        const result = await pool.query(
            `SELECT id, user_id, item_id, quantity 
             FROM cart 
             WHERE user_id = $1`, 
            [userId]
        );
        return result.rows;
    },

    addItemToCart: async (userId, itemId, quantity) => {
        await pool.query(
            `INSERT INTO cart (user_id, item_id, quantity) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (user_id, item_id) 
             DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity`, 
            [userId, itemId, quantity]
        );
    },

    removeItemFromCart: async (userId, itemId) => {
        await pool.query('DELETE FROM cart WHERE user_id = $1 AND item_id = $2', [userId, itemId]);
    },

    updateCartItem: async (userId, itemId, quantity) => {
        const cart = await pool.query('SELECT id FROM cart WHERE user_id = $1', [userId]);
        if (cart.rows.length === 0) return null; // If no cart found for user
    
        const cartId = cart.rows[0].id;
    
        const result = await pool.query(
            'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND item_id = $3 RETURNING *',
            [quantity, userId, itemId]
        );
    
        return result.rows.length > 0; // Return true if the item was updated
    }
    
};

module.exports = Cart;
