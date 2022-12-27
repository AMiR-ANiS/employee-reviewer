const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/users');
const middlewares = require('../config/middleware');

router.get('/sign-up', usersController.signUp);

router.get('/sign-in', usersController.signIn);

router.post('/create-user', usersController.createUser);

router.post(
  '/create-session',
  [
    middlewares.checkSignInInput,
    passport.authenticate('local', { failureRedirect: '/users/sign-in' })
  ],
  usersController.createSession
);

router.get(
  '/sign-out',
  middlewares.checkUserAuthentication,
  usersController.destroySession
);

module.exports = router;
