const pool = require('../config/db');

const Order = {
    addOrder: async (userId, totalPrice, deliveryAddress) => {
        const result = await pool.query(
            'INSERT INTO orders (user_id, total_price, delivery_address) VALUES ($1, $2, $3) RETURNING *',
            [userId, totalPrice, deliveryAddress]
        );
        return result.rows[0];
    },

    addOrderItem: async (orderId, itemId, itemName, itemImage, quantity) => {
        const result = await pool.query(
            'INSERT INTO order_items (order_id, item_id, item_name, item_image, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [orderId, itemId, itemName, itemImage, quantity]
        );
        return result.rows[0];
    },

    updateItemStatus: async (orderItemId, status) => {
        await pool.query('UPDATE order_items SET status = $1, scanned_at = CURRENT_TIMESTAMP WHERE id = $2', [status, orderItemId]);
    },

    getOrderItems: async (orderId) => {
        const result = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
        return result.rows;
    },

    getAllOrders: async () => {
        const result = await pool.query('SELECT * FROM orders');
        return result.rows;
    },

    deleteOrder: async (orderId) => {
        await pool.query('DELETE FROM orders WHERE id = $1', [orderId]);
    },
};

module.exports = Order;
