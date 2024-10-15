const pool = require('../config/db');

const User = {

    create: async (user) => {
        const { email, username, password, role, created_at, updated_at, verificationToken, tokenExpiration } = user;
        await pool.query(
            `INSERT INTO users (email, username, password, role, created_at, updated_at, verification_token, token_expiration) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [email, username, password, role, created_at, updated_at, verificationToken, tokenExpiration]
        );
    },

    findByEmail: async (email) => {
        try {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            return result.rows[0] || null; // Explicitly return null if no user is found
        } catch (error) {
            console.error("Error fetching user by email:", error);
            throw new Error('Database query error');
        }
    },

    findByEmailOrUsername: async (identifier) => {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [identifier, identifier]
        );
        return result.rows[0] || null; // Return the first matched user or null
    },
    

    updateTemporaryToken: async (email, token) => {
        await pool.query('UPDATE users SET verification_token = $1 WHERE email = $2', [token, email]);
    },

    clearTemporaryToken: async (email) => {
        await pool.query('UPDATE users SET verification_token = NULL WHERE email = $1', [email]);
    },

    findByTemporaryToken: async (token) => {
        const result = await pool.query('SELECT * FROM users WHERE verification_token = $1', [token]);
        return result.rows[0] || null; // Explicitly return null if no user is found
    },

    updateVerificationStatus: async (email) => {
        await pool.query(`UPDATE users SET is_verified = true, verification_token = NULL, token_expiration = NULL WHERE email = $1`, [email]);
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
