const express = require('express');
const router = express.Router();
const { getAlphabets } = require('../../controllers/yoruba/alphabetController');

router.get('/alphabets', getAlphabets);

module.exports = router;