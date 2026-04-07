const express = require('express');
const resetPasswordRouter = express.Router();
const resetPasswordController = require('../controllers/resetPasswordController');

/**
 * @swagger
 * /api/request-password-reset:
 *   post:
 *     summary: Request a password reset
 *     description: Initiates a password reset process for users who have forgotten their password by sending an OTP code to the provided email address. The email must belong to a registered user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user requesting a password reset. Must be a valid email format and match a registered user.
 *                 example: johndoe@example.com
 *                 minLength: 1
 *                 maxLength: 255
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: OTP code sent successfully to the user's email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification code has been sent to your email
 *       404:
 *         description: User not found with the provided email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The email is not found
 *       500:
 *         description: Internal server error due to unexpected issues.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while requesting password reset
 *                 error:
 *                   type: string
 *                   example: Failed to send OTP
 */

/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Resets the password for a user who has forgotten their password, using the provided email and new password. The email must belong to a verified user, and the new password must match the confirmation and be at least 8 characters long. Returns access and refresh tokens upon success.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user resetting their password. Must be a valid email format and match a registered, verified user.
 *                 example: johndoe@example.com
 *                 minLength: 1
 *                 maxLength: 255
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password for the user account. Must be at least 8 characters long.
 *                 example: NewPassword123!
 *                 minLength: 8
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: Confirmation of the new password. Must match the newPassword field exactly.
 *                 example: NewPassword123!
 *                 minLength: 8
 *             required:
 *               - email
 *               - newPassword
 *               - confirmPassword
 *     responses:
 *       200:
 *         description: Password reset successfully. Returns access and refresh tokens.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Bad request due to mismatched passwords or unverified email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: New password and confirmation do not match
 *       404:
 *         description: User not found with the provided email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error due to unexpected issues.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while changing the password
 *                 error:
 *                   type: string
 *                   example: Database connection failed
 */
resetPasswordRouter.post('/api/request-password-reset', resetPasswordController.requestPasswordReset_post);
resetPasswordRouter.post('/api/reset-password', resetPasswordController.resetPassword_post);

module.exports = resetPasswordRouter;