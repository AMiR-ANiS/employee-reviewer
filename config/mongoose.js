const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1/employee_review_system';

mongoose.connect(uri);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to Database!'));

db.once('open', () => {
  console.log('Connected to Database!');
});

module.exports = {
  db,
  uri
};
