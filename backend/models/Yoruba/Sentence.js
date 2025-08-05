// models/Yoruba/Sentence.js
const sentenceSchema = new mongoose.Schema({
  sentence: String,
  translation: String,
  pronunciation: String,
});
module.exports = mongoose.model('YorubaSentence', sentenceSchema);