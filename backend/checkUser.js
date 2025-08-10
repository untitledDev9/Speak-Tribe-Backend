const mongoose = require('mongoose');
const User = require('./models/User'); // adjust path if your models folder is elsewhere

// Your MongoDB URI
const MONGO_URI = 'mongodb+srv://Speak_Tribe:SpeakTribe@cluster0.e4rwieb.mongodb.net/Speak_Tribe?retryWrites=true&w=majority&appName=Cluster0';

// Replace with the userId from your decoded JWT
const userId = '6893ea814922844f8d3dc2c3';

(async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    const user = await User.findById(userId);
    if (user) {
      console.log('User found:');
      console.log(user);
    } else {
      console.log('User not found');
    }

    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
