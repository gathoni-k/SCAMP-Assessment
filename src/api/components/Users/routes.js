const router = require('express').Router();
const controllers = require('./controllers');

// signup
router.post('/signup', controllers.signup);

module.exports = router;
