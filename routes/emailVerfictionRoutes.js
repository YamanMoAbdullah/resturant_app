const express = require('express');
const emailVerificationRouter = express.Router();
const emailVerificationController = require('../controllers/emailVerificationController.js');

/**
 * @swagger
 * /api/verify-email:
 *   post:
 *     summary: Verify a user's email
 *     description: Verifies a user's email address using the provided OTP code. If successful, marks the user as verified, deletes the OTP record, and returns access and refresh tokens. The email must exist in the database, and the OTP code must be valid and not expired.
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
 *                 description: The email address of the user to verify. Must be a valid email format and match an existing user.
 *                 example: johndoe@example.com
 *                 minLength: 1
 *                 maxLength: 255
 *               otpCode:
 *                 type: string
 *                 description: The OTP code sent to the user's email. Must match the code stored in the database and not be expired.
 *                 example: 123456
 *                 minLength: 1
 *                 maxLength: 10
 *             required:
 *               - email
 *               - otpCode
 *     responses:
 *       200:
 *         description: Email verification completed successfully. Returns access and refresh tokens.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email verification is completed
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 isVerified:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request due to invalid or expired OTP code.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or expired OTP code
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
 *                   example: Internal server error
 */
emailVerificationRouter.post('/api/verify-email', emailVerificationController.verify_email_post);

module.exports = emailVerificationRouter;