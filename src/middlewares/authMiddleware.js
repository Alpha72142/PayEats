const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token
    const email = req.body.email; // Get the email from the request body or headers

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        // Verify token validity
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        const isValid = await User.checkTokenValidity(decoded.email); // Use the decoded email

        if (!isValid) {
            return res.status(401).json({ message: 'Token is invalid or expired' });
        }

        // If valid, proceed to the next middleware
        next();
    } catch (error) {
        console.error('Token validation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = authMiddleware;
