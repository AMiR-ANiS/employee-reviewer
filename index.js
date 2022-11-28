require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

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
