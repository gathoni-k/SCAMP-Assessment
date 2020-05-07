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

// routes
app.use('/api/user', routes.userRoutes);
app.use('/api/product', routes.productRoutes);
app.use('/api/order', routes.orderRoutes);

module.exports = app;
