const express = require('express');
const registerRouter = express.Router();
const registerController = require('../controllers/registerController');
const registerErrorHandler = require('../middleware/registerErrorHandler');

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided name, email, and password. Sends an OTP to the provided email for verification. The password is hashed before storage, and the email must be unique and valid.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The username of the new user. Must be unique, trimmed, and non-empty.
 *                 example: JohnDoe
 *                 minLength: 1
 *                 maxLength: 255
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
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: Confirmation of the password. Must match the password field exactly.
 *                 example: Password123!
 *                 minLength: 8
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *     responses:
 *       201:
 *         description: User registered successfully, OTP sent to the provided email for verification.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Otp sent to email, Please verify to complete registration
 *       400:
 *         description: Bad request due to invalid input, such as missing fields, invalid email, passwords not matching, or validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unsuccessful registration
 *                 errors:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Please enter your name
 *                     email:
 *                       type: string
 *                       example: Please enter a valid email
 *                     hashPassword:
 *                       type: string
 *                       example: Minmum password length is 8 characters
 *                     password:
 *                       type: string
 *                       example: Password and confirm password do not match
 *       409:
 *         description: Conflict due to duplicate name or email already in use.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unsuccessful registration
 *                 errors:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: This name is already in use, Please choose a different one
 *                     email:
 *                       type: string
 *                       example: This email is already in use, Please choose a different one
 *       500:
 *         description: Internal server error due to unexpected issues.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unsuccessful registration
 *                 errors:
 *                   type: object
 *                   properties:
 *                     general:
 *                       type: string
 *                       example: Internal Server Error
 */
registerRouter.post('/api/register', registerController.register_post);
registerRouter.use(registerErrorHandler);

module.exports = registerRouter;