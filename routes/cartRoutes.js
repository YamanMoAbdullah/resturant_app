const express = require('express');
const cartRouter = express.Router();
const cartController = require('../controllers/cartController');
const isAuth = require('../middleware/auth');

/**
 * @swagger
 * /api/cart-items:
 *   get:
 *     summary: Get all items in the authenticated user's cart
 *     description: |
 *       Returns all items that the authenticated user has added to their cart.
 *       Requires a valid JWT in the Authorization header. If the user doesn't have a cart yet, returns 404.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cart items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: get cart items successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       cart_id:
 *                         type: string
 *                       menu_item_id:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       unit_price:
 *                         type: number
 *       404:
 *         description: No cart found for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: There is no cart for this user
 *       401:
 *         description: User not authenticated or token invalid
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/add-to-cart:
 *   post:
 *     summary: Add a new item to the cart
 *     description: |
 *       Adds a specific menu item to the user's cart.
 *       If the user doesn't have a cart yet, one will be created automatically.
 *       If the item already exists in the cart, its quantity will be increased.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menu_item_id
 *               - quantity
 *             properties:
 *               menu_item_id:
 *                 type: string
 *                 description: The ID of the menu item to add
 *                 example: 64b1c2de4f15ef35ecabc123
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Quantity to add (must be a positive integer)
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: cart item added
 *                 cartItem:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     cart_id:
 *                       type: string
 *                     menu_item_id:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     unit_price:
 *                       type: number
 *       400:
 *         description: Invalid input (e.g. quantity ≤ 0 or menu item not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quantity must be a positive integer
 *       404:
 *         description: Menu item not found
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/update-cart:
 *   patch:
 *     summary: Update or remove a cart item
 *     description: |
 *       Updates the quantity of a specific item in the cart.
 *       If the quantity is set to 0, the item will be removed.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cart_id
 *               - menu_item_id
 *               - quantity
 *             properties:
 *               cart_id:
 *                 type: string
 *                 description: The ID of the cart
 *                 example: 64b1f3a21c7f9d7aacf7890b
 *               menu_item_id:
 *                 type: string
 *                 description: The ID of the menu item in the cart
 *                 example: 64b1c2de4f15ef35ecabc123
 *               quantity:
 *                 type: integer
 *                 description: |
 *                   New quantity for the item.  
 *                   - If 0, the item will be removed.  
 *                   - If ≥ 1, the quantity will be updated.
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated or removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart item updated successfully
 *       400:
 *         description: Missing or invalid input
 *       404:
 *         description: Cart item not found
 *       401:
 *         description: Unauthorized access (token missing or expired)
 *       500:
 *         description: Server error
 */

cartRouter.get('/api/cart-items', isAuth, cartController.CartItems_get);
cartRouter.post('/api/add-to-cart', isAuth, cartController.addToCart_post);
cartRouter.patch('/api/update-cart', isAuth, cartController.updateCard_patch);

module.exports = cartRouter;