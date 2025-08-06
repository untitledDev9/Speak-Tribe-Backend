const mongoose = require('mongoose');
const YorubaAlphabet = require('../models/Yoruba/Alphabet');
const dotenv = require('dotenv');
dotenv.config();

const alphabets = [
  { letter: "A", pronunciation: "ah" },
  { letter: "B", pronunciation: "beh" },
  { letter: "D", pronunciation: "deh" },
  { letter: "E", pronunciation: "eh" },
  { letter: "Ẹ", pronunciation: "air" },
  { letter: "F", pronunciation: "feh" },
  { letter: "G", pronunciation: "geh" },
  { letter: "GB", pronunciation: "gb" },
  { letter: "H", pronunciation: "heh" },
  { letter: "I", pronunciation: "ee" },
  { letter: "J", pronunciation: "jeh" },
  { letter: "K", pronunciation: "keh" },
  { letter: "L", pronunciation: "leh" },
  { letter: "M", pronunciation: "meh" },
  { letter: "N", pronunciation: "neh" },
  { letter: "O", pronunciation: "oh" },
  { letter: "Ọ", pronunciation: "aw" },
  { letter: "P", pronunciation: "peh" },
  { letter: "R", pronunciation: "reh" },
  { letter: "S", pronunciation: "seh" },
  { letter: "Ṣ", pronunciation: "sh" },
  { letter: "T", pronunciation: "teh" },
  { letter: "U", pronunciation: "oo" },
  { letter: "W", pronunciation: "weh" },
  { letter: "Y", pronunciation: "yeh" }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await YorubaAlphabet.deleteMany();
    await YorubaAlphabet.insertMany(alphabets);
    console.log("✅ Yoruba Alphabets Seeded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB();
