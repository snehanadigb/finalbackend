const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail's service
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your App Password
    },
});

// Function to send an email
const sendEmail = async (to, subject, text) => {
    console.log("Sending email...");
    try {
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER, // Sender address
            to: to, // List of recipients
            subject: subject, // Subject line
            text: text, // Plain text body
        });

        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Call the sendEmail function
sendEmail('test@example.com', 'Test Subject', 'This is a test email body.');
