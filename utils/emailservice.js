const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your App Password
    },
});

// Function to send an email with OTP
const sendEmailWithOTP = async (to, subject, otp) => {
    console.log("Sending email with OTP...");
    try {
        console.log(process.env.EMAIL_USER);
        console.log(process.env.EMAIL_PASS);

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER, // Sender address
            to: to, // List of recipients
            subject: subject, // Subject line
            text: `Your OTP for email verification is: ${otp}`, // Plain text body
        });

        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmailWithOTP;
