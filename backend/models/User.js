const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: Number
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
    required: true
  },
  progress: {
    alphabet: { type: Number, default: 0 },
    words: { type: Number, default: 0 },
    sentences: { type: Number, default: 0 }
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
 selectedLanguage: {
  type: String,
  default: null,
},
}, { timestamps: true }, { collection: 'userInfo' })

module.exports = mongoose.model('userInfo', UserSchema)