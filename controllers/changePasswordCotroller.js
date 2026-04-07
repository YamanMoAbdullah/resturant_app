const express = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

module.exports.change_password_patch = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmNewPassword} = req.body;

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json( { message: 'New password and confirmation do not match'} );
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcryptjs.compare(oldPassword, user.hashPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        user.hashPassword = newPassword;
        await user.save();

        res.status(200).json( { message: 'Password updated successfully'} );
    }
    catch(err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
}