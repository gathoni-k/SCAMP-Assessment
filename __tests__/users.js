/* eslint-disable no-undef */
const mongoose = require('mongoose');
require('dotenv').config();

const { MONGOURITEST } = process.env;
const { createUser } = require('../src/api/components/Users/db');
const User = require('../src/api/components/Users/model');
// connect to db
beforeAll(async () => {
  await mongoose.connect(`${MONGOURITEST}/testUser`, { useNewUrlParser: true, useUnifiedTopology: true });
});


// check if user is saved
describe('Save user in db', () => {
  const user = {
    name: 'Mary Gathoni',
    email: 'maryg@email.com',
    password: 'P@ssworder#',
    role: 'admin'
  };
  it('should create a new user', async (done) => {
    const createdUser = await createUser(user);
    expect(createdUser.name).toBe('Mary Gathoni');
    done();
  });
  it('should save user in db', async (done) => {
    const foundUser = await User.findOne({ email: user.email });
    if (foundUser) {
      expect(foundUser.name).toBe('Mary Gathoni');
    }
    done();
  });
});

describe('should not save user in db', () => {
  it('should return a falsy', async () => {
    const faultyUser = {
      email: 'maryg@email.com',
      password: 'P@ssworder#',
    };
    const createdUser = await createUser(faultyUser);
    expect(createdUser).toBeFalsy();
  });
});

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

afterEach(async () => {
  await removeAllCollections();
});
