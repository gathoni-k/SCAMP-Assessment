const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET } = process.env;
module.exports = {
  genToken: (user) => jwt.sign({
    payload: user.id
  }, JWT_SECRET, { expiresIn: '1h' })
};
