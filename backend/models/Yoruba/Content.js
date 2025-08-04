// models/Yoruba/Content.js

const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  section: {
    type: String,
    enum: ['alphabet', 'colors', 'greetings', 'words', 'sentences'],
    required: true
  },
  data: [Object], // can hold letters, words, phrases etc
});

module.exports = mongoose.model('YorubaContent', contentSchema);
