const express = require('express');
const profileRouter = express.Router();
const isAuth = require('../middleware/auth');
const profileController = require('../controllers/profileController');

/**
 * @swagger
 * /api/get-profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the profile information (full name and email) of the authenticated user. Requires a valid JWT token in the Authorization header, and the user must have a valid refresh token in the database.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get profile successfuly
 *                 fullName:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: johndoe@example.com
 *       401:
 *         description: Unauthorized request due to missing token, invalid token format, or user logged out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No token provided
 *       403:
 *         description: Forbidden request due to invalid or expired JWT token.
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
 *                   example: Internal server error
 *                 error:
 *                   type: string
 *                   example: Database connection failed
 */
profileRouter.get('/api/get-profile', isAuth, profileController.get_profile);

module.exports = profileRouter;