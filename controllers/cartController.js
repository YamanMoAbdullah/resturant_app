const MenuItem = require('../models/menu_item');
const Cart = require('../models/cart');
const CartItem = require('../models/cart_item');

module.exports.addToCart_post = async (req, res) => {
    try {
        const userId = req.user.id;
        const {menu_item_id, quantity} = req.body;
        const menuItem = await MenuItem.findById(menu_item_id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found'});
        }
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be a positive integer' });
        }
        let cart = await Cart.findOne({ user_id: userId });
        if (!cart) {
            cart = await Cart.create({ user_id: userId });
        }
        let cartItem = await CartItem.findOne({ cart_id: cart._id, menu_item_id: menuItem._id});
        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        }
        else {
            cartItem = await CartItem.create({
                cart_id: cart._id,
                menu_item_id: menuItem._id,
                quantity,
                unit_price: menuItem.price
            });
        }
        res.status(201).json( {message: 'cart item added', cartItem: cartItem} );
    }
    catch(err) {
        res.status(500).json({ 
            message: 'Failed to add item to cart',
            error: err.message,
        });
    }
}

module.exports.updateCard_patch = async (req, res) => {
    try {
        const { cart_id, menu_item_id, quantity } = req.body;

        if (!cart_id || !menu_item_id || quantity === undefined) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (!Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).json({ success: false, message: 'Quantity must be a non-negative integer' });
        }

        const cartItem = await CartItem.findOne({ cart_id: cart_id, menu_item_id: menu_item_id });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        if (quantity === 0) {
            await CartItem.deleteOne({ _id: cartItem._id }); // ✅ تصحيح هنا
            return res.status(200).json({ message: 'Item removed from cart' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({ message: 'Cart item updated successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Failed to update cart item', error: err.message });
    }
}


module.exports.CartItems_get = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ user_id: userId });
        if (!cart) {
            return res.status(404).json({ message: 'There is no cart for this user' });
        }
        const cartItems = await CartItem.find( {cart_id: cart._id } );
        res.status(200).json( {
            message: 'get cart items successfully',
            data: cartItems
        });
    }
    catch(err) {
        res.status(500).json( {message: 'failed to gat cart items', error: err.message});
    }
}