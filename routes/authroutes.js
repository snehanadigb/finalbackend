const express = require('express');
const { register, login, verifyEmailWithOTP,forgotPassword,resetPassword } = require('../controllers/authcontroller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmailWithOTP);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword);

module.exports = router;
