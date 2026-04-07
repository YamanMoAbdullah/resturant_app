const EmailVerification = require('../models/emailVerification');
const nodemailer = require('nodemailer');

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    }
  });

  const mailOptions = {
    from: '"MyApp" <no-reply@myapp.com>',
    to: email,
    subject: 'Your Email Verification Code',
    text: `Your verification code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}

async function createAndSendOTP(email) {
  const otpCode = generateOTP();
  await EmailVerification.deleteMany({ email });
  // ends after 10 minutes
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await EmailVerification.create({ email, otpCode, expiresAt });

  await sendOTPEmail(email, otpCode);
}

module.exports = {
  generateOTP,
  sendOTPEmail,
  createAndSendOTP,
};
