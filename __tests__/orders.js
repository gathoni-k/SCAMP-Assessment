const mongoose = require('mongoose');
require('dotenv').config();

const { MONGOURITEST } = process.env;

const {
  placeOrder,
  getOrder,
  updateOrder,
  deleteOrder
} = require('../src/api/components/Orders/db');

const { createProduct } = require('../src/api/components/Products/db');
const { createUser } = require('../src/api/components/Users/db');

// demo products
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
  inventoryOnHand: 17,
  inventoryReceived: 100,
  minimumRequired: 20
};

const user = {
  name: 'Mary Gathoni',
  email: 'maryg@email.com',
  password: 'P@ssworder#',
  role: 'sales'
};

const otherUser = {
  name: 'Mary Gathoni',
  email: 'maryg@email.com',
  password: 'P@ssworder#',
  role: 'admin'
};

let salesUser;
let adminUser;

const order = {
  product: product.productName,
  amount: 20,
};

// connect to db
beforeAll(async (done) => {
  try {
    await mongoose.connect(`${MONGOURITEST}/testOrders`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  } catch (error) {
    done(error);
  }
});

beforeEach(async (done) => {
  try {
    // create products
    await createProduct(product);
    await createProduct(otherProduct);
    salesUser = await createUser(user);
    adminUser = await createUser(otherUser);
    done();
  } catch (error) {
    done(error);
  }
});

describe('Place Order', () => {
  it('should return an order to sales user', async (done) => {
    try {
      const res = await placeOrder(order, salesUser);
      expect(res.error).toBeFalsy();
      expect(res.orderTitle).toBe('Coke 300ml(can) order');
      done();
    } catch (error) {
      done(error);
    }
  });
  it('should return an order to admin user', async (done) => {
    try {
      const res = await placeOrder(order, adminUser);
      expect(res.error).toBeFalsy();
      expect(res.orderTitle).toBe('Coke 300ml(can) order');
      done();
    } catch (error) {
      done(error);
    }
  });
});

describe('Get Order', () => {
  it('should return an order', async (done) => {
    try {
      const newOrder = await placeOrder(order, salesUser);
      const res = await getOrder(newOrder.id);
      expect(res.orderTitle).toBe(`${newOrder.orderTitle}`);
      done();
    } catch (error) {
      done(error);
    }
  });
  it('should return an error object', async (done) => {
    try {
      const newOrder = await placeOrder(order, salesUser);
      const res = await getOrder(`${newOrder.id}p`);
      expect(res.error).toBeTruthy();
      done();
    } catch (error) {
      done(error);
    }
  });
});

describe('Update order', () => {
  it('return updated order', async (done) => {
    const update = {
      amountOrdered: 50
    };
    try {
      const newOrder = await placeOrder(order, salesUser);
      const res = await updateOrder(newOrder.id, update);
      console.log(res);
      expect(res.amountOrdered).toBe(50);
      done();
    } catch (error) {
      done(error);
    }
  });
});

describe('Delete order', () => {
  it('should return true', async (done) => {
    try {
      const newOrder = await placeOrder(order, salesUser);
      const res = await deleteOrder(newOrder.id);
      expect(res).toBe(true);
      done();
    } catch (error) {
      done(error);
    }
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
