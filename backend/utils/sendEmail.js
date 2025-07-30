const nodemailer = require('nodemailer')

const sendEmail = async (to, subject, text) => {
  // set up gmail service
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth : {
      user: process.env.EMAIL_USER,   // your email to send the otp
      pass: process.env.EMAIL_PASS    // your app password
    }
  })

  // send the email
  await transporter.sendMail({
    from: `"SpeakTribe" <${process.env.EMAIL_USER}>`,  // who it's from
    to,     // reciptant
    subject,    // email subject
    text    // body of the email
  })
}

module.export= sendEmail;