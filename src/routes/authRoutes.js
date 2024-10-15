const express = require('express');
const { login, verifyOTP, signUp, verifyEmail } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', login); // Login with email only
router.post('/verify-otp', verifyOTP); // Verify OTP

// Protect dashboard route for all authenticated users
router.get('/dashboard', authMiddleware(), (req, res) => {
    res.status(200).json({ message: 'Welcome to your dashboard!' });
});

// Example: Protect product routes only for product managers
router.post('/products', authMiddleware(['product_manager']), (req, res) => {
    // Add product logic here
    res.status(200).json({ message: 'Product added successfully!' });
});

// Example: Vendor manager route
router.get('/vendors', authMiddleware(['vendor_manager']), (req, res) => {
    // Vendor logic here
    res.status(200).json({ message: 'Vendor data retrieved successfully!' });
});

// Example: Customer can access only cart-related functionality
router.post('/cart', authMiddleware(['customer']), (req, res) => {
    // Cart logic here
    res.status(200).json({ message: 'Cart updated successfully!' });
});

router.post("/signup", signUp);
router.get("/verify-email/:token", verifyEmail);
router.post('/verify-otp/:token', verifyOTP);


module.exports = router;
