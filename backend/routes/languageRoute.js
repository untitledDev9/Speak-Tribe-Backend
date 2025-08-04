const express = require('express');
const { selectLanguage } = require('../controllers/languageController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/select', authMiddleware, selectLanguage);

module.exports = router;
