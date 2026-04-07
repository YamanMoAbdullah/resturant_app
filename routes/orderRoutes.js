const express = require('express');
const orderRouter = express.Router();
const orderController = require('../controllers/orderController');
const isAuth = require('../middleware/auth');

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders for the authenticated user
 *     description: |
 *       Retrieves a list of all orders placed by the currently logged-in user,
 *       along with their items. Orders are sorted from newest to oldest.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders with their items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Orders fetched successfully
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       user_id:
 *                         type: string
 *                       total_price:
 *                         type: number
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             menu_item_id:
 *                               type: string
 *                             quantity:
 *                               type: integer
 *                             unit_price:
 *                               type: number
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/create-order:
 *   post:
 *     summary: Create a new order from user's cart
 *     description: |
 *       Converts the current cart of the authenticated user into a confirmed order.  
 *       All cart items are moved to the order, and the cart is cleared afterwards.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully with items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *                 order:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user_id:
 *                       type: string
 *                     total_price:
 *                       type: number
 *                     status:
 *                       type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       menu_item_id:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       unit_price:
 *                         type: number
 *       400:
 *         description: Cart is empty or contains invalid items
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No cart found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     description: Returns a specific order and its items by the order ID.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order and its items fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user_id:
 *                       type: string
 *                     total_price:
 *                       type: number
 *                     status:
 *                       type: string
 *                 itemsOrder:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       menu_item_id:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       unit_price:
 *                         type: number
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/order-status/{id}:
 *   patch:
 *     summary: Update the status of an order
 *     description: |
 *       Updates the status of an existing order.  
 *       Allowed statuses: `pending`, `shipped`, `delivered`.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, shipped, delivered]
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Status updated
 *                 order:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     status:
 *                       type: string
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */

orderRouter.get('/api/orders', isAuth, orderController.Orders_get);
orderRouter.post('/api/create-order', isAuth, orderController.createOrder_post);
orderRouter.get('/api/orders/:id', isAuth, orderController.getOrderById);
orderRouter.patch('/api/order-status/:id', isAuth, orderController.updateOrderStatus);

module.exports = orderRouter;