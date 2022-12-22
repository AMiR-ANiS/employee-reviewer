const express = require('express');
const router = express.Router();
const middlewares = require('../config/middleware');
const adminController = require('../controllers/admin');

router.get(
  '/add-employee',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsAdmin],
  adminController.addEmployee
);
router.post(
  '/create-employee',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsAdmin],
  adminController.createEmployee
);

module.exports = router;
