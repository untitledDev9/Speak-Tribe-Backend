// backend/addUser.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();
const connectDB = require('./config/db');

const addDefaultUser = async () => {
  await connectDB();

  const hashedPassword = await bcrypt.hash('123456', 10);

  const user = new User({
    username: 'testuser',
    email: 'testuser@example.com',
    password: hashedPassword,
  });

  try {
    await user.save();
    console.log('✅ Default user created successfully');
  } catch (error) {
    console.error('❌ Failed to create user:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

addDefaultUser();
