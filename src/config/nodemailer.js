const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file

// Create a transporter for Brevo (Sendinblue)
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com', // Corrected Brevo SMTP server
    port: 587,                    // Use port 587 for TLS
    secure: false,                // Set to false for STARTTLS (port 587)
    auth: {
        user: process.env.EMAIL_USER, // Brevo login (7d0368001@smtp-brevo.com)
        pass: process.env.EMAIL_PASS  // Brevo SMTP key (VIsMqyS0TdOwLJ3k)
    }
});

// Async function to send an email
const sendEmail = async (mailOptions) => {
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info.response; // Return response for logging or further processing
    } catch (error) {
        console.error('Error sending email:', error); // Log error
        throw error; // Propagate error if needed
    }
};

module.exports = { sendEmail };
