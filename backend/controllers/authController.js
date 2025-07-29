const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};








const nodemailer = require('nodemailer');

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const lowerEmail = email.toLowerCase();

    const userExists = await User.findOne({ email: lowerEmail });
    if (userExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate OTP and expiration
    // const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    // const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    const newUser = new User({
      firstName,
      lastName,
      email: lowerEmail,
      password,
      verified: false,
      otp,
      otpExpires
    });

    await newUser.save();

    // Send OTP to user's email
    await sendOTPEmail(lowerEmail, otp);

    res.status(201).json({
      message: 'Signup successful. OTP sent to email for verification.',
      email: lowerEmail,
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
};






exports.updateUsername = async (req, res) => {
  const userId = req.user.id;
  const { newUsername } = req.body;

  try {
    const user = await User.findById(userId);

    const now = new Date();
    const lastChange = user.lastUsernameChange || new Date(0);
    const diffDays = Math.floor((now - lastChange) / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return res.status(400).json({ error: `You can change your username again in ${7 - diffDays} day(s).` });
    }

    user.username = newUsername;
    user.lastUsernameChange = now;
    await user.save();

    res.status(200).json({ message: 'Username updated successfully', username: newUsername });
  } catch (err) {
    res.status(500).json({ error: 'Server error updating username' });
  }
};





exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.verified) {
      return res.status(400).json({ error: 'User already verified' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Update user as verified
    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      },
    });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ error: 'Server error during verification' });
  }
};
