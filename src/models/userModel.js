const pool = require('../config/db');

const User = {
    findByEmail: async (email) => {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    },
    // New method to update OTP
    updateOTP: async (email, otp, expiration) => {
        await pool.query('UPDATE users SET otp = $1, otp_expiration = $2 WHERE email = $3', [otp, expiration, email]);
    },
    // Optionally, you may want to clear OTP after verification
    clearOTP: async (email) => {
        await pool.query('UPDATE users SET otp = NULL, otp_expiration = NULL WHERE email = $1', [email]);
    },
};

module.exports = User;
