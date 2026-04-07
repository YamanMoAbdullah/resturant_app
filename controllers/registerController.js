const express = require('express');
const User = require('../models/user');
const { createAndSendOTP } = require('../services/otpService');

module.exports.register_post = async (req, res, next) => {
    try {
        const { name, password, confirmPassword, email} = req.body;

        if (password != confirmPassword) {
            return res.status(400).json({ message: 'Password and confirm password do not match' });
        }

        const newUser = await User.create({ name, hashPassword: password, email});

        await createAndSendOTP(newUser.email);

        res.status(201).json( {message: 'Otp sent to email, Please verify to complete registeration'});
    }
    catch(err) {
        next(err);
    }
}

