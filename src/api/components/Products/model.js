const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new Schema({
  productName: {
    type: String,
    required: true
  },
  productLabel: {
    type: String,
    required: true
  },
  startingInventory: {
    type: Number,
    required: true
  },
  inventoryReceived: {
    type: Number
  },
  inventorySold: {
    type: Number
  },
  inventoryOnHand: {
    type: Number,
    required: true
  },
  minimumRequired: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Product', ProductSchema);
