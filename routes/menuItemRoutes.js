const express = require('express');
const menuItemRouter = express.Router();
const menuItemController = require('../controllers/menuItemController');
const isAuth = require('../middleware/auth');
const upload = require('../middleware/upload');

/**
 * @swagger
 * /api/get-menu-items:
 *   get:
 *     summary: Get all menu items
 *     description: Retrieves a list of all menu items from the database. No authentication is required.
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Menu items retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Menu items fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60d5f484f5a4d2b4b8f9e4a1
 *                       image:
 *                         type: string
 *                         example: https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/menu_items/burger.jpg
 *                       name:
 *                         type: string
 *                         example: Cheeseburger
 *                       description:
 *                         type: string
 *                         example: A juicy beef patty with melted cheese
 *                       price:
 *                         type: number
 *                         example: 8.99
 *                       category:
 *                         type: string
 *                         example: burgers
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-10-01T12:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-10-01T12:00:00.000Z
 *       500:
 *         description: Internal server error due to unexpected issues.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error while fetching menu items
 *                 error:
 *                   type: string
 *                   example: Database connection failed
 */

/**
 * @swagger
 * /api/create-menu-item:
 *   post:
 *     summary: Create a new menu item
 *     description: Creates a new menu item with the provided details and an uploaded image. Requires authentication via a valid JWT token. The image must be in JPEG, JPG, PNG, WEBP, or GIF format and not exceed 5MB. The name, description, price, and category are required, and the name must not exceed 50 characters.
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file for the menu item (JPEG, JPG, PNG, WEBP, or GIF, max 5MB).
 *               name:
 *                 type: string
 *                 description: The name of the menu item. Must not be empty and cannot exceed 50 characters.
 *                 example: Cheeseburger
 *                 minLength: 1
 *                 maxLength: 50
 *               description:
 *                 type: string
 *                 description: A description of the menu item. Must not be empty.
 *                 example: A juicy beef patty with melted cheese
 *                 minLength: 1
 *               price:
 *                 type: number
 *                 description: The price of the menu item. Must be a non-negative number.
 *                 example: 8.99
 *                 minimum: 0
 *               category:
 *                 type: string
 *                 description: The category of the menu item. Must not be empty.
 *                 example: burgers
 *                 minLength: 1
 *             required:
 *               - image
 *               - name
 *               - description
 *               - price
 *               - category
 *     responses:
 *       201:
 *         description: Menu item created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Menu item created successfully
 *                 item:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5f484f5a4d2b4b8f9e4a1
 *                     image:
 *                       type: string
 *                       example: https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/menu_items/burger.jpg
 *                     name:
 *                       type: string
 *                       example: Cheeseburger
 *                     description:
 *                       type: string
 *                       example: A juicy beef patty with melted cheese
 *                     price:
 *                       type: number
 *                       example: 8.99
 *                     category:
 *                       type: string
 *                       example: burgers
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-10-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-10-01T12:00:00.000Z
 *       400:
 *         description: Bad request due to missing or invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All fields are required
 *       401:
 *         description: Unauthorized request due to missing token or invalid token format.
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
 *       500:
 *         description: Internal server error due to unexpected issues.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error while creating menu item
 *                 error:
 *                   type: string
 *                   example: Failed to upload image to Cloudinary
 */

/**
 * @swagger
 * /api/update-menu-item/{id}:
 *   patch:
 *     summary: Update a menu item
 *     description: Updates an existing menu item by its ID. Requires authentication via a valid JWT token. All fields are optional, but if provided, they must meet the same validation rules as creation (name max 50 characters, non-negative price, etc.). An optional image can be uploaded to replace the existing one (JPEG, JPG, PNG, WEBP, or GIF, max 5MB).
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 60d5f484f5a4d2b4b8f9e4a1
 *         description: The ID of the menu item to update.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional new image file for the menu item (JPEG, JPG, PNG, WEBP, or GIF, max 5MB).
 *               name:
 *                 type: string
 *                 description: Optional new name for the menu item. Must not be empty and cannot exceed 50 characters if provided.
 *                 example: Cheeseburger Deluxe
 *                 minLength: 1
 *                 maxLength: 50
 *               description:
 *                 type: string
 *                 description: Optional new description for the menu item. Must not be empty if provided.
 *                 example: A deluxe beef patty with extra cheese
 *                 minLength: 1
 *               price:
 *                 type: number
 *                 description: Optional new price for the menu item. Must be a non-negative number if provided.
 *                 example: 9.99
 *                 minimum: 0
 *               category:
 *                 type: string
 *                 description: Optional new category for the menu item. Must not be empty if provided.
 *                 example: deluxe
 *                 minLength: 1
 *     responses:
 *       200:
 *         description: Menu item updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Menu item updated successfully
 *                 item:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5f484f5a4d2b4b8f9e4a1
 *                     image:
 *                       type: string
 *                       example: https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/menu_items/burger_deluxe.jpg
 *                     name:
 *                       type: string
 *                       example: Cheeseburger Deluxe
 *                     description:
 *                       type: string
 *                       example: A deluxe beef patty with extra cheese
 *                     price:
 *                       type: number
 *                       example: 9.99
 *                     category:
 *                       type: string
 *                       example: deluxe
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-10-01T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-10-02T12:00:00.000Z
 *       400:
 *         description: Bad request due to invalid or empty fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Name must not be empty if provided
 *       401:
 *         description: Unauthorized request due to missing token or invalid token format.
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
 *         description: Menu item not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Menu item not found
 *       500:
 *         description: Internal server error due to unexpected issues.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error while updating menu item
 *                 error:
 *                   type: string
 *                   example: Failed to upload image to Cloudinary
 */

/**
 * @swagger
 * /api/delete-menu-item/{id}:
 *   delete:
 *     summary: Delete a menu item
 *     description: Deletes a menu item by its ID. Requires authentication via a valid JWT token.
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 60d5f484f5a4d2b4b8f9e4a1
 *         description: The ID of the menu item to delete.
 *     responses:
 *       200:
 *         description: Menu item deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Menu item deleted successfully
 *       401:
 *         description: Unauthorized request due to missing token or invalid token format.
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
 *         description: Menu item not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Menu item not found
 *       500:
 *         description: Internal server error due to unexpected issues.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error while deleting menu item
 *                 error:
 *                   type: string
 *                   example: Database connection failed
 */
menuItemRouter.get('/api/get-menu-items', menuItemController.getAllMenuItems_get);
menuItemRouter.post('/api/create-menu-item', upload.single('image'), isAuth, menuItemController.createMenuItem_post);
menuItemRouter.patch('/api/update-menu-item/:id', upload.single('image'), isAuth, menuItemController.updateMenuItem_patch);
menuItemRouter.delete('/api/delete-menu-item/:id', isAuth, menuItemController.deleteMenuItem_delete);


module.exports = menuItemRouter;