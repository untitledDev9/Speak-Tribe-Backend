const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const tempUsers = require('../utils/tempUsers')
const userInfo = require('../models/User')
const userModel = require('../models/User');



// Send OTP to user's email
const sendOTP = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    userName,
    phone = '',
    age = null
  } = req.body;

  try {
    // Check if user already exists in DB
    const existingUser = await userInfo.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered. Please log in.' });
    }

    // Check if an OTP is already sent and pending verification
    if (tempUsers[email]) {
      return res.status(400).json({ message: 'OTP already sent. Please check your email.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // customise email

    const otpEmail = `
      <p> </p>
    
    `
    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'SpeakTribe OTP Verification',
      text: `Your OTP is ${otp}`
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save temp user data
    tempUsers[email] = {
      firstName,
      lastName,
      userName,
      phone,
      age,
      email,
      password: hashedPassword,
      otp,
      createdAt: Date.now()
    };

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error("OTP Send Error:", error.message);
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};




// Verify OTP and register user
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const tempUser = tempUsers[email];
  if (!tempUser) {
    return res.status(400).json({ message: 'No OTP request found for this email.' });
  }

  // Expire OTP after 10 minutes
  const OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 mins in ms
  if (Date.now() - tempUser.createdAt > OTP_EXPIRY_TIME) {
    delete tempUsers[email];
    return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
  }

  // Check OTP match
  if (otp !== tempUser.otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // before creating new user, check if already exists
const existingUser = await userModel.findOne({ email: existingOtp.email });
if (existingUser) {
  return res.status(400).json({ message: 'User already exists' });
}


  try {
    // Create user after OTP verification
    const newUser = new userModel({
      firstName: tempUser.firstName,
      lastName: tempUser.lastName,
      userName: tempUser.userName,
      email: tempUser.email,
      password: tempUser.password,
      phone: tempUser.phone,
      age: tempUser.age,
      isAdmin: false
    });

    await newUser.save();
    delete tempUsers[email];

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("User Registration Error:", error.message);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};




// resend OTP
const resendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Delete any existing OTPs
    await OTPModel.deleteMany({ email });

    // Generate new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration time (10 mins)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save new OTP
    const newOTP = new OTPModel({
      email,
      otp: otpCode,
      expiresAt
    });

    await newOTP.save();

    // Send OTP via email
    await sendEmail(email, 'Your SpeakTribe OTP', `Your OTP is: ${otpCode}`);

    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ message: 'Failed to resend OTP' });
  }
};






// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userInfo.findOne({ email });
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

module.exports = { sendOTP, verifyOTP, loginUser, resendOtp };
