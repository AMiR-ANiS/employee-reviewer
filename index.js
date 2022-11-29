require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const db = require('./config/mongoose');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(expressLayouts);

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cookieParser());

app.use(express.static(path.join(__dirname, process.env.APP_ASSET_PATH)));
app.use('/', require('./routes'));

app.listen(port, (err) => {
  if (err) {
    console.log('Error in running the server', err);
    return;
  } else {
    console.log(`Server is up and running on port: ${port}`);
  }
});
