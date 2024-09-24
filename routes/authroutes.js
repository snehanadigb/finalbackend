const express = require('express');
const { register, login, verifyEmailWithOTP,resendOTP,forgotPassword,resetPassword,checkStatus } = require('../controllers/authcontroller');
const authenticateJWT=require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', authenticateJWT,verifyEmailWithOTP);
router.post('/resend-otp', authenticateJWT,resendOTP);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword);
router.post('/check-status',checkStatus);

module.exports = router;
