const db = require('./db')
const User = require('./model');

module.exports = {
  signup: async (req, res) => {
    try {
      if (!req.body.name || !req.body.email || !req.body.password || !req.body.role) throw new Error('Send user data');
      const { name, email, password, role } = req.body;
      const exists = User.findOne({ email });
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
  }
};
