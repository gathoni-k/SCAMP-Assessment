const db = require('./db');
const User = require('./model');

const { genToken } = require('../../helpers.');

module.exports = {
  signup: async (req, res) => {
    try {
      if (!req.body.name || !req.body.email || !req.body.password || !req.body.role) throw new Error('Send user data');
      const { name, email, password, role } = req.body;
      const exists = await User.findOne({ email });
      if (exists) throw new Error('Email already registered');
      const data = {
        name, email, password, role
      };
      // create user
      const newUser = await db.createUser(data);
      res.status(201).json({
        success: true,
        err: null,
        message: 'New user created',
        user: newUser
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        err: error.message,
        message: 'An error occured',
        user: null
      });
    }
  },
  login: async (req, res) => {
    // check if email exists
    try {
      const exists = await User.findOne({ email: req.body.email });
      // check if passwords match
      const match = await exists.comparePassword(req.body.password);
      if (!exists || !match) {
        return res.status(404).json({
          success: false,
          err: 'Either email or password is wrong',
          message: 'An error occcured during login',
          user: null,
          accessToken: null
        });
      }
      // sign user
      const accessToken = genToken(exists);
      return res.status(200).json({
        success: true,
        err: null,
        message: 'Successfully logged in',
        user: exists,
        accessToken
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        err: error.message,
        message: 'An error occurred during login',
        user: null,
        accessToken: null
      });
    }
  }
};
