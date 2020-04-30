const express = require('express');
require('dotenv').config();

const { MONGOURI } = process.env;

require('./db')(MONGOURI);

const app = express();

module.exports = app;
