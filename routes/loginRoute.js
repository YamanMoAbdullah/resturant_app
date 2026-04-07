const express = require('express');
const loginRouter = express.Router();
const loginController = require('../controllers/loginController');
const loginErrorHandler = require('../middleware/loginErrorHandler');

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticates a user using their email and password. If successful, returns an access token and refresh token for authenticated users, or a message prompting email verification for unverified users. The email must be valid, and the password must match the hashed password stored in the database.
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
 *                 description: The email address of the user. Must be a valid email format, unique, trimmed, and converted to lowercase.
 *                 example: johndoe@example.com
 *                 minLength: 1
 *                 maxLength: 255
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password for the user account. Must be at least 8 characters long.
 *                 example: Password123!
 *                 minLength: 8
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Login successful. Returns access and refresh tokens for verified users, or a verification prompt for unverified users.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Successful login
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Successful login, you must to verify your email
 *       400:
 *         description: Bad request due to missing email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: please Enter your email and password
 *       401:
 *         description: Unauthorized due to invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
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
 */
loginRouter.post('/api/login', loginController.login_post);
loginRouter.use(loginErrorHandler);

module.exports = loginRouter;