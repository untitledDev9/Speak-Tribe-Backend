const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Protected Dashboard Route
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    message: `Welcome to your dashboard, ${req.user.email}`,
    user: req.user, // user data from token
  });
});

module.exports = router;
