// get config vars from .env file
require('dotenv').config();

// import required dependencies
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
const logger = require('morgan');
const loggerConfig = require('./config/morgan');

// set app to use ejs as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// call the view helper function
viewHelpers(app);

// if app is in development mode, use the sass middleware for generating css from scss files
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

// make static files path available at the root of the application
app.use(express.static(path.join(__dirname, process.env.APP_ASSET_PATH)));

// use express layouts for views
app.use(expressLayouts);

// use body parser to parse form inputs
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// use cookie parser for flash messages to work
app.use(cookieParser());

// use session cookie for flash messages
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

// use passport
app.use(passport.initialize());
app.use(passport.session());
app.use(middlewares.setUserAuthentication);

// use flash messages
app.use(flash());
app.use(middlewares.setFlash);

// use morgan logger for generating production logs
app.use(logger(loggerConfig.mode, loggerConfig.options));

// use routes
app.use('/', require('./routes'));

// start the application on port number specified
app.listen(port, (err) => {
  if (err) {
    console.log('Error in running the server', err);
    return;
  } else {
    console.log(`Server is up and running on port: ${port}`);
  }
});
