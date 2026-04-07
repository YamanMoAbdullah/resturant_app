const User = require('../models/user');
const EmailVerification = require('../models/emailVerification');
const { createTokens } = require('../services/tokenService');
const Token = require('../models/token');

module.exports.verify_email_post = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const record = await EmailVerification.findOne({email});
    if (!record || record.otpCode !== otpCode) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    const isExpired = record.expiresAt < new Date();
    if (isExpired) {
      return res.status(400).json({ message: 'OTP code has expired' });
    }

    user.isVerified = true;
    await user.save();

    await EmailVerification.deleteMany({ email });

    const { accessToken, refreshToken } = createTokens(user._id);
    const newToken = new Token({
      userId: user._id,
      refreshToken,
    });
    await newToken.save();

    res.status(200).json({
      message: 'Email verfiction is completed',
      accessToken,
      refreshToken,
      isVerified: user.isVerified
    });
  } catch (err) {
    res.status(500).json( { message: 'internal server error' } ); 
  }
};
