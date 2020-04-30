const express = require('express');
require('dotenv').config();

const { MONGOURI } = process.env;

require('./db')(MONGOURI);

const app = express();

// require routes
const routes = require('./api/routes');

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/user', routes);

module.exports = app;
