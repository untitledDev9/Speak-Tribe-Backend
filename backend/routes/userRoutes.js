const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { updateUsername } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// ✅ Protected route test
router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'You accessed a protected route!',
    user: req.user
  });
});

router.put('/update-username', auth, updateUsername);

module.exports = router;
