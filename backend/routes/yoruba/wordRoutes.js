const express = require('express');
const router = express.Router();
const { getWords } = require('../../controllers/yoruba/wordController');

router.get('/words', getWords);

module.exports = router;