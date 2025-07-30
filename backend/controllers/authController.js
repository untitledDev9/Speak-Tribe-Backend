const userInfo = require('../models/User')
const bcrypt = require('bcryptjs')


export const SignUp = async(req, res) => {
  try {
  // get data from req body
  const {firstName, lastName, userName, email, phone, age, password} = req.body

  // check if user exist, using the email
  const existingUser = await userInfo.findOne({email})
  if(existingUser) {
    return res.status(400).json({
      message: 'user already exist with this email'
    })
  }

  //hash password before saving
  const salt = await bcrypt.genSalt(10)  // create salt
  const hashedPassword = await bcrypt.hash(password, salt) // hashed password

  //create new user with hashed password
  const newUser = new userInfo({
    firstName,
    lastName,
    userName,
    phone,
    age,
    email,
    password : hashedPassword // stored hased password to database
  })

  // save new user
  await newUser.save()

  //send sucess message
  res.status(201).json({
    message: 'User registered successfully'
  })
  }

  catch (error){
    res.status(500).json({
      message: 'internal server error',
      error : error.message
    })
  }
}