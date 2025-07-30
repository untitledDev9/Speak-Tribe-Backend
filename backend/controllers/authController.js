const userInfo = require('../models/User')
const bcrypt = require('bcryptjs')


export const SignUp = async (rea, res) => {
  try {
    // getting data from the request body
    const { firstName, lastName, userName, phone, email, age, password } = req.body

    // checking if user exist
    const existingUser = await userInfo.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email'
      })
    }

    // hashing of password
    const salt = await bcrypt.genSalt(10); // create salt
    const hashedPassword = await bcrypt.hash(password, salt) // hash password


       // 4. Create a new user with hashed password
    const newUser = new userInfo ({
      firstName,
      lastName,
      userName,
      email,
      phone,
      age,
      password : hashedPassword
    })

    // save new user
    await newUser.save()

    //send success response
    res.status(201).json({message: 'User Created successfully'})


  } catch (error) {
    res.status(500).json({
      message: 'Somthing went wrong on the server',
      error : error.message
    })
  }
}