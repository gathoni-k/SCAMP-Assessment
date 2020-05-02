const mongoose = require('mongoose');
require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const { createUser } = require('../src/api/components/Users/db');

const { MONGOURITEST } = process.env;

// connect to db
beforeAll(async () => {
  await mongoose.connect(`${MONGOURITEST}/testRoutes`, { useNewUrlParser: true, useUnifiedTopology: true });
});

describe('POST /users/signup', () => {
  const user = {
    name: 'Mary Gathoni',
    email: 'maeryre@email.com',
    password: 'P@ssworder#',
    role: 'admin'
  };
  it('should register user', async (done) => {
    try {
      const res = await request(app).post('/api/user/signup')
        .send(user);
      expect(res.status).toBe(201);
      expect(res.body.user.name).toBe(user.name);
      done();
    } catch (error) {
      done(error);
    }
  });
});

describe('POST /auth/login', () => {
  it('should return accesstoken', async () => {
    const user = {
      name: 'Mary Gathoni',
      email: 'maeryre@email.com',
      password: 'P@ssworder#',
      role: 'admin'
    };
    await createUser(user);
    const res = await request(app).post('/api/user/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(200);
    expect(res.body.err).toBeFalsy();
    expect(res.body.accessToken).toBeTruthy();
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
});
