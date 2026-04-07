const mongoose = require('mongoose');

// create cart item schema
const cartItemSchema = new mongoose.Schema({
  cart_id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cart',
    required: true
  },
  menu_item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  unit_price: {
    type: Number,
    required: true,
    min: [0, 'Unit price cannot be negative number'],
  },
}, { timestamps: true });

module.exports = mongoose.model('CartItem', cartItemSchema);
