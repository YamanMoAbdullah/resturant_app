const express = require('express');
const logoutRouter = express.Router();
const isAuth = require('../middleware/auth');
const logoutController = require('../controllers/logoutController');

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Log out a user
 *     description: Logs out the authenticated user by deleting all associated tokens from the database. Requires a valid JWT token in the Authorization header.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         description: Unauthorized request due to missing or invalid JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error due to unexpected issues during logout.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error during logout
 *                 error:
 *                   type: string
 *                   example: Database connection failed
 */
logoutRouter.post('/api/logout', isAuth, logoutController.logout_post);

module.exports = logoutRouter;