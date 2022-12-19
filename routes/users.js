const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/users');
const customMiddleware = require('../config/middleware');

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);
router.post('/create-user', usersController.createUser);
router.post(
  '/create-session',
  [
    customMiddleware.checkSignInInput,
    passport.authenticate('local', { failureRedirect: '/users/sign-in' })
  ],
  usersController.createSession
);
router.get(
  '/sign-out',
  passport.checkAuthentication,
  usersController.destroySession
);

module.exports = router;
