const Token = require('../models/token');
const jwt = require('jsonwebtoken');

module.exports.refresh_token_post = async (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
        
        const tokenDoc = await Token.findOne({ refreshToken });
        if (!tokenDoc) {
            return res.status(401).json({ message: 'Refresh token is invalid or expired. Please log in again.' });
        }

        const decoded = jwt.verify(refreshToken, process.env.secret);

        const accessToken = jwt.sign({ id: decoded.id }, process.env.secret, {
            expiresIn: '1h'
        });

        const newRefreshToken = jwt.sign({ id: decoded.id }, process.env.secret, {});

        tokenDoc.refreshToken = newRefreshToken;
        tokenDoc.createdAt = new Date(); 
        await tokenDoc.save();

        return res.json({ refreshToken, accessToken });

    } catch (err) {
        return res.status(401).json({
            message: 'Refresh token is invalid or expired. Please log in again.'
        });
    }
}