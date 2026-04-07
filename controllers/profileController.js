const User = require('../models/user');

module.exports.get_profile = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id); 
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Get profile successfuly',
            fullName: currentUser.name,
            email: currentUser.email
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};
