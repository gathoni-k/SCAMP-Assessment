const mongoose = require('mongoose');
require('dotenv').config();

const { MONGOURITEST } = process.env;

const {
  createProduct,
  deleteProduct,
  updateProduct,
  getProduct,
  getProducts,
  productExists
} = require('../src/api/components/Products/db');
const Product = require('../src/api/components/Products/model');

// connect to db
beforeAll(async () => {
  await mongoose.connect(`${MONGOURITEST}/testProduct`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

const product = {
  productName: 'Coke 300ml(can)',
  productLabel: 'Coke',
  startingInventory: 100,
  inventoryOnHand: 100,
  inventoryReceived: 100,
  minimumRequired: 20
};

const otherProduct = {
  productName: 'Sprite 300ml(can)',
  productLabel: 'Coke',
  startingInventory: 100,
  inventoryOnHand: 100,
  inventoryReceived: 100,
  minimumRequired: 20
};

describe('Create Product', () => {
  it('should create a new product', async (done) => {
    const createdproduct = await createProduct(product);
    expect(createdproduct.productName).toBe(product.productName);
    done();
  });
  it('should save product in db', async (done) => {
    const foundProduct = await Product.findOne({ email: product.email });
    if (foundProduct) {
      expect(foundProduct.productName).toBe(product.productName);
    }
    done();
  });
});

describe('Delete Product', () => {
  it('should delete product', async (done) => {
    const newProduct = await deleteProduct(product);
    const productId = newProduct.id;
    const deletedProduct = await deleteProduct(productId);
    expect(deletedProduct).toBeTruthy();
    done();
  });
});

describe('Update product', () => {
  const update = {
    inventoryOnHand: 120,
    inventoryReceived: 50,
    inventorySold: 30
  };
  it('should update product', async (done) => {
    const newproduct = await createProduct(product);
    const productId = newproduct.id;
    const updatedProduct = await updateProduct(update, productId);
    expect(updatedProduct.inventorySold).toBe(update.inventorySold);
    done();
  });
});

describe('Get product', () => {
  it('should get product', async (done) => {
    const newProduct = await createProduct(product);
    const productId = newProduct.id;
    const gotProduct = await getProduct(productId);
    expect(gotProduct.productName).toBe(product.productName);
    done();
  });
});

describe('Get all products', () => {
  it('should return all products ', async (done) => {
    await createProduct(product);
    await createProduct(otherProduct);
    const products = getProducts();
    expect(products).toBeTruthy();
    done();
  });
});

describe('CHeck if product exists', () => {
  let productId
  it('should return true', async (done) => {
    const newProduct = await createProduct(product);
    productId = newProduct.id;
    const exists = await productExists(productId);
    expect(exists).toBe(true);
    done();
  });
  it('should return false', async (done) => {
    const exists = await productExists(`${productId}p`);
    expect(exists).toBe(false);
    done();
  });
});
async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

async function dropAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    try {
      await collection.drop()
    } catch (error) {
      if (error.message === 'ns not found') return
      if (error.message.includes('a background operation is currently running')) return
      console.log(error.message)
      return
    }
    }
  }

afterEach(async () => {
  await removeAllCollections();
});

afterAll(async () => {
  await dropAllCollections();
  await mongoose.connection.close();
});
