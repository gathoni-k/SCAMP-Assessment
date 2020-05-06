const Order = require('./model');
const Product = require('../Products/model');

module.exports = {
  placeOrder: async (order, user) => {
    try {
      const product = await Product.findOne({ productName: order.product });
      if (!product) {
        throw new Error('Product not found');
      }
      const newOrder = new Order({
        orderTitle: `${order.product} order`,
        amountOrdered: order.amount
      });
      newOrder.productId.push(product);
      newOrder.userId.push(user);
      await newOrder.save();
      return newOrder;
    } catch (error) {
      return {
        error: error.message
      };
    }
  },
  deleteOrder: async (orderId) => {
    try {
      const deleted = await Order.findByIdAndDelete(orderId);
      if (!deleted) {
        throw new Error();
      }
      return true;
    } catch (error) {
      return false;
    }
  },
  updateOrder: async (orderId, update) => {
    try {
      await Order.findByIdAndUpdate(orderId, {$set: update});
      const updated = await Order.findById(orderId);
      if (!updated) {
        throw new Error();
      }
      return updated;
    } catch (error) {
      return false;
    }
  },
  getOrder: async (orderId) => {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      return {
        error: error.message
      };
    }
  }
};
