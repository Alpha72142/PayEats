const pool = require('../config/db');

const User = {
    findByEmail: async (email) => {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    },
    updateOTP: async (email, otp, expiration) => {
        await pool.query('UPDATE users SET otp = $1, otp_expiration = $2 WHERE email = $3', [otp, expiration, email]);
    },
    clearOTP: async (email) => {
        await pool.query('UPDATE users SET otp = NULL, otp_expiration = NULL WHERE email = $1', [email]);
    },
    updateJWT: async (email, token, expiration) => {
        await pool.query('UPDATE users SET jwt_token = $1, jwt_expiration = $2 WHERE email = $3', [token, expiration, email]);
    },
    clearJWT: async (email) => {
        await pool.query('UPDATE users SET jwt_token = NULL, jwt_expiration = NULL WHERE email = $1', [email]);
    },
    checkTokenValidity: async (email) => {
        const user = await User.findByEmail(email);
        const currentTime = new Date();

        // Check if the token is expired
        if (user && user.jwt_token && user.jwt_expiration && currentTime > new Date(user.jwt_expiration)) {
            // Token is expired, clear it from the database
            await User.clearJWT(email);
            return false; // Token is not valid
        }
        return true; // Token is valid
    },
};

module.exports = User;
