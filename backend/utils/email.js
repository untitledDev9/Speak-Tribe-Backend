const nodemailer = require('nodemailer');

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: email,
    subject: 'Verify Your SpeakTribe Account',
    text: `Your OTP is ${otp}. It expires in 10 minutes.`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;
