const router = require('express').Router();
const controllers = require('./controllers');

// signup
router.post('/signup', controllers.signup);
router.post('/auth/login', controllers.login);
module.exports = router;
