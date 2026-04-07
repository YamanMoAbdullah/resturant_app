const Order = require('../models/order');
const OrderItems = require('../models/order_item');
const Cart = require('../models/cart');
const CartItem = require('../models/cart_item');

module.exports.Orders_get = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const orders = await Order.find({ user_id: userId }).sort({ createdAt: -1 });

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItems.find({ order_id: order._id });

        return {
          ...order.toObject(),
          items: items
        };
      })
    );

    res.status(200).json({
      message: 'Orders fetched successfully',
      orders: ordersWithItems
    });

  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

module.exports.createOrder_post = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID found' });
    }
    const cart = await Cart.findOne( {user_id: userId });
    if (!cart) {
      return res.status(404).json( {message: 'There is no cart for this user' } ); 
    }
    const cartItems = await CartItem.find( {cart_id: cart._id});
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let total_price = 0;

    for (const item of cartItems) {
      if (
        !item.menu_item_id ||
        typeof item.quantity !== 'number' ||
        typeof item.unit_price !== 'number' ||
        item.quantity < 1 ||
        item.unit_price < 0
      ) {
        return res.status(400).json({ message: 'Invalid item format or values' });
      }

      total_price += item.quantity * item.unit_price;
    }

    const order = await Order.create({
      user_id: userId,
      total_price,
      status: 'pending',
    });

    const orderItems = cartItems.map(item => ({
      order_id: order._id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    const savedOrderItems = await OrderItems.insertMany(orderItems);

    
    await CartItem.deleteMany({ cart_id: cart._id });
    
    res.status(201).json({
      message: 'Order created successfully',
      order: order,
      items: savedOrderItems,
    });

  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: err.message }); 
  }
};

module.exports.getOrderById = async (req,res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json( {message: 'Order not found'});
    }
    const itemsOrder = await OrderItems.find( {order_id: orderId});
    res.status(200).json( { order, itemsOrder} );
  }
  catch(err) {
    res.status(500).json( { message: 'Internal server error', error: err.message});
  }
}

module.exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const allwedStatueORder = ['pending', 'shipped', 'delivered', 'cancelled', 'processing'];
  if (!allwedStatueORder.includes(status)) {
    return res.status(400).json( {message: 'Invalid status value'} );
  }
  
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json( {message: 'Order not found'} );
    }
    order.status = status;
    res.status(200).json({ message: 'Status updated', order });
  }
  catch(err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}