const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET } = process.env;
module.exports = {
  genToken: (user) => jwt.sign({
    id: user.id,
    role: user.role
  }, JWT_SECRET, { expiresIn: '1h' }),
  isAuthorized: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Please login' });
      }
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  },
  isAdmin: (req, res, next) => {
    try {
      const { role } = req.user;
      if (role !== 'admin') throw new Error();
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized, admins only' });
    }
  },
};
