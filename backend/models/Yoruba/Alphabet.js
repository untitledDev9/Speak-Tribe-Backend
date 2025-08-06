const mongoose = require('mongoose');

const alphabetSchema = new mongoose.Schema({
  letter: {
    type: String,
    required: true,
  },
  pronunciation: {
    type: String,
    required: true,
  }
});

const YorubaAlphabet = mongoose.model('YorubaAlphabet', alphabetSchema);
module.exports = YorubaAlphabet;
