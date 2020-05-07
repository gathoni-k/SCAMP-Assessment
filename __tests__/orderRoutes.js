/* eslint-disable no-undef */
const mongoose = require('mongoose');
require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const { createProduct } = require('../src/api/components/Products/db');
const { placeOrder } = require('../src/api/components/Orders/db');
const { createUser } = require('../src/api/components/Users/db');

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

const salesUser = {
  name: 'Mary Gathoni',
  email: 'mare@email.com',
  password: 'P@ssworder#',
  role: 'sales'
};

const adminUser = {
  name: 'Jane G',
  email: 'sdfre@email.com',
  password: 'P@ssworder#',
  role: 'admin'
};

const order = {
  product: product.productName,
  amount: 20,
};

const otherOrder = {
  product: product.productName,
  amount: 50,
};

const login = async (user) => {
  try {
    const res = await request(app).post('/api/user/auth/login')
      .send({ email: user.email, password: user.password });
    return res.body.accessToken;
  } catch (error) {
    console.log(error);
  }
};
let newProduct;
beforeAll(async (done) => {
  await mongoose.connect(`${MONGOURITEST}/testOrderRoutes`, { useNewUrlParser: true, useUnifiedTopology: true });
  done();
});

beforeEach(async (done) => {
  try {
    newProduct = await createProduct(product);
    // signup
    await request(app)
      .post('/api/user/signup')
      .send(salesUser);
    done();
  } catch (error) {
    done(error);
  }
});

describe('GET /order/all', () => {
  it('should not return all orders', async (done) => {
    const res = await request(app)
      .get('/api/order/all')
      .expect(404);
    expect(res.body.orders).toBe(null);
    done();
  });
  it('should get all orders', async (done) => {
    const user = await createUser(adminUser);
    await placeOrder(order, user);
    await placeOrder(otherOrder, user);
    const res = await request(app)
      .get('/api/order/all')
      .expect(200);
    expect(res.body.success).toBe(true);
    done();
  });
});

describe('GET /order/one/:orderId', () => {
  let orderId;
  it('should return order', async (done) => {
    await login(salesUser);
    const user = await createUser(adminUser);
    const newOrder = await placeOrder(order, user);
    orderId = newOrder.id;
    const res = await request(app)
      .get(`/api/order/one/${orderId}`);
    expect(res.body.order).toBeTruthy();
    done();
  });
});

describe('POST /api/order/create', () => {
  it('should not create order if user not logged in', async (done) => {
    const res = await request(app)
      .post(`/api/order/create/${newProduct.productName}`)
      .send(order);
    expect(res.body.order).toBeFalsy();
    done();
  });
  it('should return created order if user is logged in', async (done) => {
    try {
      const token = await login(salesUser);
      const res = await request(app)
        .post(`/api/order/create/${newProduct.productName}`)
        .set('Authorization', `Bearer ${token}`)
        .send(order)
        .expect(201);
      expect(res.body.message).toBe('Order made successfully');
      done();
    } catch (error) {
      done(error);
    }
  });
});

describe('POST /api/order/update/:orderId', () => {
  let user;
  let newOrder;
  it('should update order', async (done) => {
    const token = await login(salesUser);
    user = await createUser(adminUser);
    newOrder = await placeOrder(order, user);
    const orderId = newOrder.id;
    const res = await request(app)
      .post(`/api/order/update/${orderId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.message).toBe('Order updated successfully');
    done();
  });
});

describe('Delete order', () => {
  let token;
  let orderId;
  it('should not delete product from dB', async () => {
    token = await login(salesUser);
    user = await createUser(adminUser);
    const newOrder = await placeOrder(order, user);
    orderId = newOrder.id;
    const res = await request(app)
      .delete(`/api/order/delete/${orderId}p`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.message).toBe('A problem occurred while deleting order from database');
  });
  it('should delete product from dB', async () => {
    const res = await request(app)
      .delete(`/api/order/delete/${orderId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.message).toBe('Order deleted');
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
