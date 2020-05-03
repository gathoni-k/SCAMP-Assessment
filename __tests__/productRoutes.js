/* eslint-disable no-undef */
const mongoose = require('mongoose');
require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const { createProduct } = require('../src/api/components/Products/db');

const { MONGOURITEST } = process.env;
const product = {
  productName: 'Coke 300ml(can)',
  productLabel: 'Coke',
  startingInventory: 100,
  inventoryOnHand: 100,
  inventoryReceived: 100,
  inventorySold: 21,
  minimumRequired: 20
};

const otherProduct = {
  productName: 'Sprite 300ml(can)',
  productLabel: 'Coke',
  startingInventory: 100,
  inventoryOnHand: 100,
  inventoryReceived: 100,
  inventorySold: 21,
  minimumRequired: 20
};

// connect to db
beforeAll(async () => {
  await mongoose.connect(`${MONGOURITEST}/testProductRoutes`, { useNewUrlParser: true, useUnifiedTopology: true });
});

describe('GET /product/all', () => {
  it('should not return products', async (done) => {
    const res = await request(app)
      .get('/api/product/all')
      .expect(404);
    expect(res.body.products).toBe(null);
    done();
  });
  it('should get all products', async (done) => {
    await createProduct(product);
    await createProduct(otherProduct);
    const res = await request(app)
      .get('/api/product/all')
      .expect(200);

    expect(res.body.success).toBe(true);
    done();
  });
});

describe('GET /product/one/:productId', () => {
  it('should not return product', async (done) => {
    const res = await request(app)
      .get('/api/product/one');
    expect(res.body.product).toBeFalsy();
    done();
  });
  it('should return a product', async (done) => {
    const newProduct = await createProduct(product);
    const productId = newProduct.id;
    const res = await request(app)
      .get(`/api/product/one/${productId}`);
    expect(res.body.success).toBe(true);
    expect(res.body.product).toBeTruthy();
    done();
  });
});

describe('POST /api/product/create', () => {
  it('should not create product', async (done) => {
    const res = await request(app)
      .post('/api/product/create');
    expect(res.body.product).toBeFalsy();
    done();
  });
  it('should return created product', async (done) => {
    const res = await request(app)
      .post('/api/product/create')
      .send(product)
      .expect(201);
    expect(res.body.product).toBeTruthy();
    done();
  });
});

describe('POST /api/product/update/:productId', () => {
  it('should not update product if product does not exist', async (done) => {
    const newProduct = await createProduct(product);
    const productId = newProduct.id;
    const faultyId = `${productId}q`;
    const res = await request(app)
      .post(`/api/product/update/${faultyId}`);
    console.log(res.body);
    expect(res.body.message).toBe('Product not found in database');
    done();
  });
  it('should delete product from dB', async () => {
    const newProduct = await createProduct(product);
    const productId = newProduct.id;
    const res = await request(app)
      .post(`/api/product/update/${productId}`);
    expect(res.body.message).toBe('Product database successfully updated');
  });
});

describe('Delete product', () => {
  it('should delete product from dB', async () => {
    const newProduct = await createProduct(product);
    const productId = newProduct.id;
    const faultyId = `${productId}q`;
    const res = await request(app)
      .post(`/api/product/update/${faultyId}`);
    expect(res.body.message).toBe('Product not found in database');
  });
  it('should delete product from dB', async () => {
    const newProduct = await createProduct(product);
    const productId = newProduct.id;
    const res = await request(app)
      .delete(`/api/product/delete/${productId}`);
    expect(res.body.message).toBe('Product successfully deleted from database');
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
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    try {
      await collection.drop()
    } catch (error) {
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
