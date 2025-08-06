// models/Yoruba/Word.js
const wordSchema = new mongoose.Schema({
  word: String,
  meaning: String,
  pronunciation: String,
});
module.exports = mongoose.model('YorubaWord', wordSchema);


