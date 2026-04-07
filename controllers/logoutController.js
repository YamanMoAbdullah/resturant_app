const Token = require('../models/token');

module.exports.logout_post = async (req, res) => {
    try {
        const userId = req.user.id;
        await Token.deleteMany( { userId: userId});

        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch(err) {
        res.status(500).json( {message: 'Server error during logout', error: err.message} );
    }
}
