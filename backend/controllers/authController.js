const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const tempUsers = require('../utils/tempUsers')
const OtpModel = require("../models/Otp");
const userModel = require('../models/User');



// Send OTP to user's email
const sendOTP = async (req, res) => {
  const { firstName, lastName, email, password, userName = "New User", phone = "", age = null } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered. Please log in.' });
    }

    const existingOtp = await OtpModel.findOne({ email });
    if (existingOtp) {
      return res.status(400).json({ message: 'OTP already sent. Please check your email.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'SpeakTribe OTP Verification',
      text: `Your OTP is ${otp}`,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save OTP and temp user data
    await OtpModel.create({
      email,
      otp,
    });

    // Optional: store hashed password and other user info in frontend or separate tempUser model

    // You may pass back user info as needed
    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error("Send OTP Error:", error.message);
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
};





// Verify OTP and register user
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OtpModel.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: "No OTP request found or OTP expired." });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // Optional: collect temp user data from frontend or another temp collection
    const { firstName, lastName, password, userName = "New User", phone = "", age = null } = req.body;

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      userName,
      phone,
      age
    });

    await newUser.save();

    await OtpModel.deleteOne({ email });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error.message);
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
};





// resend OTP
const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OtpModel.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'SpeakTribe OTP Verification (Resent)',
      text: `Your OTP is ${otp}`,
    });

    res.status(200).json({ message: "New OTP sent to your email." });
  } catch (error) {
    console.error("Resend OTP Error:", error.message);
    res.status(500).json({ message: "Failed to resend OTP", error: error.message });
  }
};







// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { sendOTP, verifyOTP, loginUser, resendOTP };
