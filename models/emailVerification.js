const mongoose = require('mongoose');

const emailVerfictionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otpCode: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model('EmailVerification', emailVerfictionSchema);