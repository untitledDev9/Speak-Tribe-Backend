const Alphabet = require('../models/Yoruba/Alphabet');

// @desc    Get all Yoruba Alphabets
// @route   GET /api/yoruba/alphabets
// @access  Public
const getAlphabets = async (req, res) => {
  try {
    const data = await YorubaAlphabet.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getAlphabets };
