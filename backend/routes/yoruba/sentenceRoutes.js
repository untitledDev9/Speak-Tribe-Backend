const express = require('express');
const router = express.Router();
const { getSentences } = require('../../controllers/yoruba/sentenceController');

router.get('/words', getSentences);

module.exports = router;