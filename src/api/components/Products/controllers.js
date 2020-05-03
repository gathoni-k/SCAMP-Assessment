const db = require('./db');

module.exports = {
  getProducts: async (req, res) => {
    try {
      const products = await db.getProducts();
      if (!products) {
        return res.status(404).json({
          success: false,
          message: 'No products retrieved from database',
          products: null
        });
      }
      res.status(200).json({
        success: true,
        message: 'Successfully retrieved products from database',
        products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'An error occurred while retrieving products from database',
        products: null
      });
    }
  },
  getProduct: async (req, res) => {
    try {
      const product = await db.getProduct(req.params.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found in database',
          product: null
        });
      }
      res.status(200).json({
        success: true,
        message: 'Successfully retrieved product from database',
        product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'An error occurred while retrieving product from database',
        product: null
      });
    }
  },
  createProduct: async (req, res) => {
    try {
      if (!req.body) {
        res.status(400).json({
          success: false,
          message: 'Product data not provided',
          product: null
        });
        return;
      }
      const {
        productName,
        productLabel,
        startingInventory,
        inventoryReceived,
        inventorySold,
        inventoryOnHand,
        minimumRequired
      } = req.body;
      const data = {
        productName,
        productLabel,
        startingInventory,
        inventoryReceived,
        inventorySold,
        inventoryOnHand,
        minimumRequired
      };
      const product = await db.createProduct(data);
      if (!product) {
        throw new Error();
      }
      res.status(201).json({
        success: true,
        message: 'Successfully added new product to database',
        product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'An error occurred while adding new product to database',
        product: null
      });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const exists = await db.productExists(req.params.productId);
      if (!exists) {
        return res.status(401).json({
          success: false,
          message: 'Product not found in database',
          product: null
        });
      }
      if (!req.body) {
        return res.status(301).json({
          success: false,
          message: 'Product data not provided',
          product: null
        });
      }
      const {
        productName,
        productLabel,
        startingInventory,
        inventoryReceived,
        inventorySold,
        inventoryOnHand,
        minimumRequired
      } = req.body;
      const update = {
        productName,
        productLabel,
        startingInventory,
        inventoryReceived,
        inventorySold,
        inventoryOnHand,
        minimumRequired
      };
      const updated = await db.updateProduct(update, req.params.productId);
      if (!updated) {
        throw new Error();
      }
      res.status(201).json({
        success: false,
        message: 'Product database successfully updated',
        product: updated
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'An error occured while updating product database',
        product: null
      });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const exists = await db.productExists(req.params.productId);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: 'Product not found in database'
        });
      }
      const deleted = await db.deleteProduct(req.params.productId);
      if (!deleted) {
        throw new Error();
      }
      return res.status(200).json({
        success: true,
        message: 'Product successfully deleted from database'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while deleting product from database'
      });
    }
  }
};
