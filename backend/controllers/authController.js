// const userInfo = require('../models/User')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const tempUsers = require('../utils/tempUsers')
const userInfo = require('../models/User')

// get otp
const sendOTP = async (req, res) => {
  const {firstName, lastName, userName, phone, email, age, password} = req.body

  // check if email already in tempuser store or DB (to prevent spam or dublicates)
  if (tempUsers[email]) {
    return res.status(400).json({
      message: 'OTP already sent. Pleade check your email.'
    })
  }

  // generate a 6-digit OTP number
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  // sent OTP via email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,     // your email
      pass: process.env.EMAIL_PASS,      // your app password
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'SpeakTribe OTP Verifivation',
    text: `Your OTP is ${otp}`
  }

  try {
    await transporter.sendMail(mailOptions)

    // hash the password before temporary saving
    const hasedPassword = await bcrypt.hash(password, 10)

    // store all user data + OTP temporarily (not in database yet)
    tempUsers[email] = {
      firstName,
      lastName,
      userName,
      age,
      phone,
      email,
      password : hasedPassword,
      otp,
      createdAt: Date.now()
    }

    // send status on sucess otp
    res.status(200).json({
      message: 'OTP sent to your email'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Error sending OTP'})
  }
}


// verifying OTP
const verifyOTP = async (req, res) => {
  const {email, otp} = req.body

  const tempUser = tempUsers[email]

  if(!tempUser) {
    return res.status(400).json({message: 'No OTP request found for this email.'})
  }

  // check if OTP is correct
  if(tempUser.otp !== otp) {
    return res.status(400).json({message: 'invalid OTP'})
  }

  // save the user to the database
  const newUser = new userInfo({
    firstName: tempUser.firstName,
    lastName: tempUser.lastName,
    userName: tempUser.userName,
    email: tempUser.email,
    phone: tempUser.phone,
    age: tempUser.age,
    password: tempUser.password,
  })

  try {
    await newUser.save()
    delete tempUsers[email];    // clean up temp store
    res.status(201).json({message: 'User verified and registered successfully'})
  } catch (error) {
    console.error("DB Save Error:", error);
return res.status(500).json({ message: "Error saving user to DB", error: error.message });

  }




}


// Login
const loginUser = async (req, res) => {
  const {email, password} = req.body
try {
  // check if user exists
  const user = await userInfo.findOne({email})
  if(!user) {
    return res.status(400).json({message: 'Invalid email or password'})
  }

  // compare password
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch) {
    return res.status(400).json({message: 'Invalid email or password'})
  }

  //  create JWT token
  const token = jwt.sign(
    {userId: user._id},
    process.env.JWT_SECRET,
    {expiresIn: '7d'}
  )

  // send token and user (without password)
  const {password: _, ...userData} = user.toObject()  // remove password
  res.status(200).json({
    message: 'Login successful',
    token,
    user: userData
  });

  } catch(err) {
    res.status(500).json({message: 'server error', err: err.message})
  }
}






module.exports = {
  sendOTP,
  verifyOTP,
  loginUser
};



// export const SignUp = async(req, res) => {
//   try {
//   // get data from req body
//   const {firstName, lastName, userName, email, phone, age, password} = req.body

//   // check if user exist, using the email
//   const existingUser = await userInfo.findOne({email})
//   if(existingUser) {
//     return res.status(400).json({
//       message: 'user already exist with this email'
//     })
//   }

//   //hash password before saving
//   const salt = await bcrypt.genSalt(10)  // create salt
//   const hashedPassword = await bcrypt.hash(password, salt) // hashed password

//   //create new user with hashed password
//   const newUser = new userInfo({
//     firstName,
//     lastName,
//     userName,
//     phone,
//     age,
//     email,
//     password : hashedPassword // stored hased password to database
//   })

//   // save new user
//   await newUser.save()

//   //send sucess message
//   res.status(201).json({
//     message: 'User registered successfully'
//   })
//   }

//   catch (error){
//     res.status(500).json({
//       message: 'internal server error',
//       error : error.message
//     })
//   }
// 