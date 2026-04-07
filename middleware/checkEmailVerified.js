const User = require('../models/user');

module.exports = async (req, res, next) => {
    const userId = req.userId || req.body.userId; 

    const user = await User.findById(userId);
    if (!user || !user.isVerified) {
        return res.status(403).json({ message: 'Email is not verified' });
    }

    next();
};