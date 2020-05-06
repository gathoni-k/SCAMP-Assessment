const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrderSchema = new Schema({
  productId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  orderTitle: {
    type: String,
    required: true
  },
  amountOrdered: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  userId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

});

module.exports = mongoose.model('Order', OrderSchema);
