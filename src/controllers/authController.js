const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { sendEmail } = require("../config/nodemailer");
const User = require("../models/userModel");
require("dotenv").config();


const temporaryUserStore = {}; // In-memory store for unverified users

exports.signUp = async (req, res) => {
    const { email, username, password, role } = req.body;

    // Validate the input fields
    if (!email || !password || !role) {
        return res.status(400).json({ message: "Email, password, and role are required." });
    }

    // Check for existing user
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: "Email is already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token and its expiration
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const tokenExpiration = new Date(Date.now() + 3600000); // 1 hour from now

    // Get the user's IP address
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Temporarily store the user details with email included
    temporaryUserStore[email] = {
        email,
        username,
        password: hashedPassword,
        role,
        created_at: new Date(),
        updated_at: new Date(),
        verificationToken,
        tokenExpiration,
        device_id: ipAddress, // Store the IP address as the device ID
    };

    // Send a verification email
    const mailOptions = {
        from: process.env.OTP_SENDER_EMAIL,
        to: email,
        subject: "Verify Your Email",
        html: `<p>Thank you for signing up, ${username || ''}. Please verify your email by clicking <a href="${process.env.APP_URL}/verify-email/${verificationToken}">here</a>.</p>`,
    };

    await sendEmail(mailOptions);

    res.status(201).json({ message: "User registered successfully. A verification email has been sent.", verificationToken: verificationToken });
};




exports.verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        // Check if the user exists in the temporary store
        if (!temporaryUserStore[email]) {
            return res.status(400).json({ message: "Invalid or expired verification token." });
        }

        const userDetails = temporaryUserStore[email];

        // Create the user in the database
        await User.create({
            email: userDetails.email,
            username: userDetails.username,
            password: userDetails.password,
            role: userDetails.role,
            created_at: userDetails.created_at,
            updated_at: userDetails.updated_at,
            device_id: userDetails.device_id,
        });

        // Update verification status
        await User.updateVerificationStatus(email);

        // Remove the user from the temporary store
        delete temporaryUserStore[email];

        res.status(200).json({ message: "Email verified successfully. User created." });
    } catch (error) {
        console.error("Verification server error:", error);
        res.status(500).json({ message: "Server error" });
    }
};




exports.login = async (req, res) => {
    const { identifier, password } = req.body;

    // Validate the input
    if (!identifier || !password) {
        return res.status(400).json({ message: "Email/username and password are required." });
    }

    try {
        // Find user by email or username
        const user = await User.findByEmailOrUsername(identifier);

        // If user not found
        if (!user) {
            return res.status(401).json({ message: "Invalid email/username or password." });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email/username or password." });
        }

        // Check device ID or IP
        const currentDeviceId = req.ip; // Get the current user's IP address
        if (user.device_id === currentDeviceId) {
            // Same device - log in successfully
            const jwtToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "3h" });
            return res.json({ jwtToken });
        } else {
            // Different device - send OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
            const otpExpiration = new Date(Date.now() + 300000); // OTP valid for 5 minutes
            const verificationToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "5m" }); // Create temporary token

            // Update user with OTP and expiration
            await User.updateOTP(user.email, otp, otpExpiration);
            await User.updateTemporaryToken(user.email, verificationToken); // Store temporary token in the database

            // Send OTP email
            const mailOptions = {
                from: process.env.OTP_SENDER_EMAIL,
                to: user.email,
                subject: "Your OTP Code",
                text: `Your OTP code is ${otp}. It is valid for 5 minutes. Use this temporary token for verification: ${verificationToken}`,
            };
            await sendEmail(mailOptions);

            return res.json({ message: "OTP sent to your email. Please verify to log in.", verificationToken: verificationToken , otp: otp });
        }
    } catch (error) {
        console.error("Login server error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// OTP Verification after login
exports.verifyOTP = async (req, res) => {
    const { token } = req.params; // Extract temporary token from URL
    const { otp } = req.body; // Extract OTP from request body

    try {
        // Find the user using the temporary token
        const user = await User.findByTemporaryToken(token); // Implement this method in the User model

        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Verify the OTP against the user record
        if (user.otp !== otp || new Date() > new Date(user.otp_expiration)) {
            return res.status(401).json({ message: "Invalid or expired OTP" });
        }

        // Clear OTP and temporary token after successful verification
        await User.clearOTP(user.email);
        await User.clearTemporaryToken(user.email); // Clear the temporary token

        // Generate a JWT token for the user
        const jwtToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "3h" });

        // Send the token in the response
        res.json({ jwtToken });
    } catch (error) {
        console.error("OTP verification server error:", error);
        res.status(500).json({ message: "Server error" });
    }
};





