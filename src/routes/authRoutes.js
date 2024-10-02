const express = require('express');
const { login, verifyOTP } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login); // Login with email only
router.post('/verify-otp', verifyOTP); // Verify OTP

module.exports = router;
// hi testing out git