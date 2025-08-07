const Alphabet = require('../../models/Yoruba/Alphabet');

const getAlphabets = async (req, res) => {
  try {
    const data = await Alphabet.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getAlphabets };
