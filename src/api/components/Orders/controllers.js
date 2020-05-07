const User = require('../Users/model');
const db = require('./db');

module.exports = {
  getOrder: async (req, res) => {
    try {
      const order = await db.getOrder(req.params.orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: order.error,
          order: null
        });
      }
      res.status(200).json({
        success: true,
        message: 'Successfully retrieved order from database',
        order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'An error occurred while retrieving order from database',
        order: null
      });
    }
  },
  getOrders: async (req, res) =>  {
    try {
      const orders = await db.getAll();
      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No orders found',
          orders: null
        });
      }
      res.status(200).json({
        success: true,
        message: 'Successfully retrieved orders from database',
        orders
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'An error occurred while retrieving orders from database',
        order: null
      });
    }
  },
  createOrder: async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).json({
          success: false,
          message: 'Order data not provided',
          product: null
        });
      }
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'User should be valid',
          product: null
        });
      }
      const data = {
        amount: req.body,
        product: req.params.productName
      };
      const order = await db.placeOrder(data, user);
      if (!order) {
        throw new Error();
      }
      return res.status(201).json({
        success: true,
        message: 'Order made successfully',
        order
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'A problem occurred while adding order to database',
        order: null
      });
    }
  },
  deleteOrder: async (req, res) => {
    try {
      const deleted = await db.deleteOrder(req.params.orderId);
      if (!deleted) {
        throw new Error();
      }
      return res.status(200).json({
        success: true,
        message: 'Order deleted',
        order: null
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'A problem occurred while deleting order from database',
        order: null
      });
    }
  },
  updateOrder: async (req, res) => {
    try {
      const updated = await db.updateOrder(req.params.orderId, req.body.update);
      if (!updated) {
        throw new Error();
      }
      return res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        order: updated
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        message: 'A problem occurred while updating order',
        order: null
      });
    }
  }
};
