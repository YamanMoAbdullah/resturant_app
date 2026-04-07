    const express = require('express');
    const User = require('../models/user');
    const bcryptjs = require('bcryptjs');
    const Token = require('../models/token');
    const { createTokens } = require('../services/tokenService');
    const validator = require('validator');

    module.exports.login_post = async (req, res, next) => {
        try {
            const { email, password } = req.body;
        
            if (!email || !password) {
                throw new Error('please Enter your email and password');
            }

            if (!validator.isEmail(email)) {
                throw new Error('Please Enter a valid email');
            }
            const foundUser = await User.findOne( { email });
            if (!foundUser) {
                throw new Error('Invalid email or password');
            }
            
            const validPassword = await bcryptjs.compare(password, foundUser.hashPassword);
            if (!validPassword) {
                throw new Error('Invalid email or password');
            }

            const existingToken = await Token.findOne({ userId: foundUser._id });
            if (existingToken) {
                await Token.findOneAndDelete( { userId: foundUser._id });
            }
            const { accessToken, refreshToken } = createTokens(foundUser._id);

            // edit refresh token in database 
            const newToken = new Token({
                userId: foundUser._id,
                refreshToken,
            });
            await newToken.save();
            if (foundUser.isVerified)
            res.status(201).json( {message: 'Successful login', refreshToken, accessToken, isVerified: foundUser.isVerified});
            else 
            res.status(201).json( { message: "Successful login, you must to verify your email"} );
        }
        catch(err) {
            next(err);
        }
    };