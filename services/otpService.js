const EmailVerification = require('../models/emailVerification');
const nodemailer = require('nodemailer');

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
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
  const newVerification = await EmailVerification.create({ email, otpCode, expiresAt });

  try {
    await sendOTPEmail(email, otpCode);
  } catch (error) {
    console.error(`Error sending OTP to ${email}:`, error);
    await EmailVerification.deleteOne({ _id: newVerification._id });
    throw new Error('Failed to send verification email, please try again later');
  }
}

module.exports = {
  generateOTP,
  sendOTPEmail,
  createAndSendOTP,
};
