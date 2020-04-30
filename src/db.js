const mongoose = require('mongoose');

module.exports = (uri) => {
  mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

  const db = mongoose.connection;

  db.once('open', () => console.log('Mongoose default connection open'));

  db.on('error', () => console.log('An error occured'));
};
