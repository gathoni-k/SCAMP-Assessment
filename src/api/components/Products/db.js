const Product = require('./model');

module.exports = {
  createProduct: async (product) => {
    try {
      // create new Product
      const newProduct = new Product(product);
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
      if (!updated) {
        throw new Error();
      }
      return updated;
    } catch (error) {
      return false;
    }
  },
  getProduct: async (id) => {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error();
      }
      return product;
    } catch (error) {
      return false;
    }
  },
  getProducts: async () => {
    try {
      const products = await Product.find({});
      if (!products.length) {
        return false;
      }
      return products;
    } catch (error) {
      return false;
    }
  },
  productExists: async (id) => {
    try {
      const exists = await Product.findById(id);
      if (!exists) {
        throw new Error();
      }
      return true;
    } catch (error) {
      return false;
    }
  }
};
