const express = require('express');
const changePasswordRouter = express.Router();
const changePasswordController = require('../controllers/changePasswordCotroller');
const isAuth = require('../middleware/auth');

/**
 * @swagger
 * /api/change-password:
 *   patch:
 *     summary: Change user password
 *     description: Allows an authenticated user to change their password by providing the old password and a new password. The user must be logged in (authenticated with a valid JWT token in the Authorization header). The new password must match the confirmation and meet the minimum length requirement of 8 characters.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 description: The current password of the user. Must match the stored hashed password.
 *                 example: OldPassword123!
 *                 minLength: 8
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password for the user account. Must be at least 8 characters long.
 *                 example: NewPassword123!
 *                 minLength: 8
 *               confirmNewPassword:
 *                 type: string
 *                 format: password
 *                 description: Confirmation of the new password. Must match the newPassword field exactly.
 *                 example: NewPassword123!
 *                 minLength: 8
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmNewPassword
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *       400:
 *         description: Bad request due to mismatched new passwords or incorrect old password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: New password and confirmation do not match
 *       401:
 *         description: Unauthorized request due to missing or invalid JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No token provided
 *       403:
 *         description: Forbidden request due to invalid or expired JWT token or user logged out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or expired token
 *       404:
 *         description: User not found.
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
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 *                   example: Database connection failed
 */
changePasswordRouter.patch('/api/change-password', isAuth, changePasswordController.change_password_patch);

module.exports = changePasswordRouter;