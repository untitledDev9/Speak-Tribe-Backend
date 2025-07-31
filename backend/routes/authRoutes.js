const express = require('express');
const router = express.Router(); // ✅ This line is required

const { sendOTP, verifyOTP, loginUser } = require('../controllers/authController');

// POST route to send OTP to user's email
router.post('/send-otp', sendOTP);
// POST route to verify OTP and complete signup
router.post('/verify-otp', verifyOTP);
// POST route to login
router.post('/login', loginUser)

module.exports = router;
