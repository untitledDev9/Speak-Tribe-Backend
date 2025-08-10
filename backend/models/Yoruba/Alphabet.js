const mongoose = require('mongoose');

const alphabetSchema = new mongoose.Schema({
  letter: { type: String, required: true },
  pronunciation: { type: String, required: true },
  position: { type: Number, required: true },
});

module.exports = mongoose.model('YorubaAlphabet', alphabetSchema);
