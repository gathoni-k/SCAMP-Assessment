/* eslint-disable no-undef */
const mongoose = require('mongoose');
require('dotenv').config();

const { MONGOURITEST } = process.env;
const { createUser, deleteUser, updateUser, getUser } = require('../src/api/components/Users/db');
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

describe('Delete user', () => {
  const user = {
    name: 'Mary Gathoni',
    email: 'maryg@email.com',
    password: 'P@ssworder#',
    role: 'admin'
  };
  it('should delete user', async (done) => {
    const newUser = await createUser(user);
    const userId = newUser.id;
    const deletedUser = await deleteUser(userId);
    expect(deletedUser).toBeTruthy();
    done();
  });
});

describe('Update user', () => {
  const user = {
    name: 'Mary Gathoni',
    email: 'maryg@email.com',
    password: 'P@ssworder#',
    role: 'admin'
  };
  const update = {
    name: 'Jan Gathoni'
  };
  it('should update user', async (done) => {
    const newUser = await createUser(user);
    const userId = newUser.id;
    const updatedUser = await updateUser(update, userId);
    expect(updatedUser.name).toBe(update.name);
    done();
  });
});

describe('Get user', () => {
  const user = {
    name: 'Mary Gathoni',
    email: 'maryg@email.com',
    password: 'P@ssworder#',
    role: 'admin'
  };
  it('should get user', async (done) => {
    const newUser = await createUser(user);
    const userId = newUser.id;
    const gotUser = await getUser(userId);
    expect(gotUser.name).toBe(user.name);
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
    }
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
