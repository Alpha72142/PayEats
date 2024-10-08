const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const { sendEmail } = require('../config/nodemailer');
const User = require('../models/userModel');
require('dotenv').config();

exports.login = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        // Generate numeric OTP
        const otp = otpGenerator.generate(6, { digits: true, upperCase: false, specialChars: false });
        const expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 1); // OTP valid for 1 minute

        await User.updateOTP(email, otp, expiration);

        // Prepare email options with priority
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It is valid for 1 minute.`,
            priority: 'high'
        };

        // Send OTP email and await its completion
        await sendEmail(mailOptions);
        console.log(mailOptions);

        res.status(200).json({ message: 'OTP sent to your email. Please verify.', email });
    } catch (error) {
        console.error('Login server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify OTP function
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user || user.otp !== otp || new Date() > new Date(user.otp_expiration)) {
            return res.status(401).json({ message: 'Invalid or expired OTP' });
        }

        // Clear OTP after successful verification
        await User.clearOTP(email);

        // Generate a JWT token valid for 3 hours
        const token = jwt.sign({ id: user.id, is_admin: user.is_admin }, process.env.JWT_SECRET, { expiresIn: '3h' });

        // Set expiration date for the token
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 3); // Token valid for 3 hours

        // Store the token and its expiration in the database
        await User.updateJWT(email, token, expirationDate);

        // Send the token in the response
        res.json({ token });
    } catch (error) {
        console.error('OTP verification server error:', error); // Log the error for debugging
        res.status(500).json({ message: 'Server error' });
    }
};

