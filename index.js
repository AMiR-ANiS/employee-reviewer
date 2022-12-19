require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const db = require('./config/mongoose');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const viewHelpers = require('./config/view-helpers');
const sassMiddleWare = require('node-sass-middleware');
const flash = require('connect-flash');
const middlewares = require('./config/middleware');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const passportLocal = require('./config/passport-local');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

viewHelpers(app);

if (process.env.APP_MODE === 'development') {
  app.use(
    sassMiddleWare({
      src: path.join(__dirname, 'assets', 'scss'),
      dest: path.join(__dirname, 'assets', 'css'),
      debug: true,
      outputStyle: 'expanded',
      prefix: '/css'
    })
  );
}
app.use(express.static(path.join(__dirname, process.env.APP_ASSET_PATH)));
app.use(expressLayouts);

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cookieParser());

app.use(
  session({
    name: process.env.APP_SESSION_COOKIE_NAME,
    secret: process.env.APP_SESSION_COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60
    },
    store: MongoStore.create({
      mongoUrl: db.uri,
      autoRemove: 'disabled'
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(middlewares.setUserAuthentication);

app.use(flash());
app.use(middlewares.setFlash);

app.use('/', require('./routes'));

app.listen(port, (err) => {
  if (err) {
    console.log('Error in running the server', err);
    return;
  } else {
    console.log(`Server is up and running on port: ${port}`);
  }
});
