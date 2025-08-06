// models/UserProgress.js
const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  language: {
    type: String,
    enum: ["Yoruba", "Igbo", "Hausa"],
  },
  progress: {
    alphabets: { type: Number, default: 0 },
    words: { type: Number, default: 0 },
    sentences: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model("UserProgress", progressSchema);
