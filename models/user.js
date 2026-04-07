const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcryptjs = require('bcryptjs');

// create user scheam with basic validaions
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: [true, "Please enter your email"],
        validate: [isEmail, 'Please enter a valid email'],
    },
    hashPassword: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [8, 'Minmum password length is 8 characters'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps:true});

// hash user passwprd pre save it in database
userSchema.pre('save', async function(next) {
     if (!this.isModified('hashPassword')) return next();

     const salt = await bcryptjs.genSalt();
     this.hashPassword = await bcryptjs.hash(this.hashPassword, salt);
     next();
});

module.exports = mongoose.model('User', userSchema);