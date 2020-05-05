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

const adminUser = {
  name: 'Mary Gathoni',
  email: 'maeryre@email.com',
  password: 'P@ssworder#',
  role: 'admin'
};
const salesUser = {
  name: 'Mary Gathoni',
  email: 'mare@email.com',
  password: 'P@ssworder#',
  role: 'sales'
};

const login = async (user) => {
  try {
    const res = await request(app).post('/api/user/auth/login')
      .send({ email: user.email, password: user.password });
    return res.body.accessToken;
  } catch (error) {
    console.log(error)
  }
};

beforeAll(async (done) => {
  await mongoose.connect(`${MONGOURITEST}/testProductRoutes`, { useNewUrlParser: true, useUnifiedTopology: true });
  done();
});

beforeEach(async (done) => {
  try {
    // signup
    await request(app)
      .post('/api/user/signup')
      .send(salesUser);
    done();
  } catch (error) {
    done(error);
  }
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
      .post('/api/product/create')
      .send(product);
    expect(res.body.product).toBeFalsy();
    done();
  });
  it('should not return created product if admin not logged in', async (done) => {
    const token = await login(salesUser);
    const res = await request(app)
      .post('/api/product/create')
      .set('Authorization', `Bearer ${token}`)
      .send(product)
      .expect(401);
    expect(res.body.message).toBe('Unauthorized, admins only');
    done();
  });
  it('should return created product if admin logged in', async (done) => {
    await request(app)
      .post('/api/user/signup')
      .send(adminUser);
    const token = await login(adminUser);
    const res = await request(app)
      .post('/api/product/create')
      .set('Authorization', `Bearer ${token}`)
      .send(product)
      .expect(201);
    expect(res.body.product).toBeTruthy();
    done();
  });
});

describe('POST /api/product/update/:productId', () => {
  it('should not update product if product does not exist', async (done) => {
    await request(app)
      .post('/api/user/signup')
      .send(adminUser);
    const token = await login(adminUser);
    const newProduct = await createProduct(product);
    const productId = newProduct.id;
    const faultyId = `${productId}q`;
    const res = await request(app)
      .post(`/api/product/update/${faultyId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.message).toBe('Product not found in database');
    done();
  });
  it('should delete product from dB', async () => {
    await request(app)
      .post('/api/user/signup')
      .send(adminUser);
    const token = await login(adminUser);
    const newProduct = await createProduct(product);
    const productId = newProduct.id;
    const res = await request(app)
      .post(`/api/product/update/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.message).toBe('Product database successfully updated');
  });
});

describe('Delete product', () => {
  it('should not delete product from dB', async () => {
    await request(app)
      .post('/api/user/signup')
      .send(adminUser);
    const token = await login(adminUser);
    const newProduct = await createProduct(product);
    const productId = newProduct.id;
    const faultyId = `${productId}q`;
    const res = await request(app)
      .post(`/api/product/update/${faultyId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.message).toBe('Product not found in database');
  });
  it('should delete product from dB', async () => {
    await request(app)
      .post('/api/user/signup')
      .send(adminUser);
    const token = await login(adminUser);
    const newProduct = await createProduct(product);
    const productId = newProduct.id;
    const res = await request(app)
      .delete(`/api/product/delete/${productId}`)
      .set('Authorization', `Bearer ${token}`);
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
