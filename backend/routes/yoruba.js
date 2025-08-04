const express = require('express');
const router = express.Router();
const { getAlphabets } = require('../controllers/yorubaController');

// GET all alphabets
router.get('/alphabets', getAlphabets);

module.exports = router;
