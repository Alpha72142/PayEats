const express = require('express');
const { login, verifyOTP } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', login); // Login with email only
router.post('/verify-otp', verifyOTP); // Verify OTP

// Example of a protected route
router.get('/dashboard', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Welcome to your dashboard!' });
});

module.exports = router;
