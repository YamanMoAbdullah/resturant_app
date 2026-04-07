const mongoose = require('mongoose');

// create cart scheam
const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',   
    required: true
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Cart', cartSchema);
