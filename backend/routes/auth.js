const express = require('express');
const router = express.Router();
const { loginUser, signup, verifyEmail } = require('../controllers/authController');

router.post('/login', loginUser);
router.post('/signup', signup);
router.post('/verify', verifyEmail);

module.exports = router;
