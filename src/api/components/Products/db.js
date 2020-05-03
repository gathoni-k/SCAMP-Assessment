const Product = require('./model');

module.exports = {
  createProduct: async (product) => {
    try {
      const { productName,
        productLabel,
        startingInventory,
        inventoryReceived,
        inventorySold,
        inventoryOnHand,
        minimumRequired } = product;
      // create new Product
      const newProduct = new Product({
        productName,
        productLabel,
        startingInventory,
        inventoryReceived,
        inventorySold,
        inventoryOnHand,
        minimumRequired
      });
      await newProduct.save();
      return newProduct;
    } catch (error) {
      return false;
    }
  },
  deleteProduct: async (id) => {
    try {
      await Product.findByIdAndDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  },
  updateProduct: async (update, id) => {
    try {
      await Product.findOneAndUpdate({ _id: id }, { $set: update });
      const updated = await Product.findById(id);
      return updated;
    } catch (error) {
      return false;
    }
  },
  getProduct: async (id) => {
    try {
      const product = await Product.findById(id);
      return product;
    } catch (error) {
      return false;
    }
  },
  getProducts: async () => {
    try {
      const products = await Product.find({});
      return products;
    } catch (error) {
      return false;
    }
  }
};
