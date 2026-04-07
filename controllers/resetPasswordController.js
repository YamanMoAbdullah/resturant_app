const User = require('../models/user');
const { createAndSendOTP } = require('../services/otpService');
const bcryptjs = require('bcryptjs');
const Token = require('../models/token');
const { createTokens } = require('../services/tokenService');

exports.requestPasswordReset_post = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'The email is not found' });
        }

        await createAndSendOTP(email);

        res.status(200).json({ message: 'Verification code has been sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while requesting password reset', error: error.message });
    }
};

exports.resetPassword_post = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json( { message: 'New password and confirmation do not match'} );  
        }
        
        const user = await User.findOne( { email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'You must verify your email first' });
        }

        user.hashPassword = newPassword;
        await user.save();

        const { accessToken, refreshToken } = createTokens(user._id);

        const newToken = new Token({
            userId: user._id,
            refreshToken,
        });
        await newToken.save();

        res.status(200).json({ message: 'Password changed successfully' , refreshToken, accessToken });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while changing the password', error: error.message });
    }
};