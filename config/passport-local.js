const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        let user = await User.findOne({ email: email });

        if (!user || user.password !== password) {
          req.flash('error', 'Invalid username / password!');
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (err) {
        req.flash('error', 'Error in authenticating user!');
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    req.flash('error', 'Error while deserializing user!');
    return done(err);
  }
});

passport.checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect('/users/sign-in');
  }
};

passport.setAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
