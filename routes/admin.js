const express = require('express');
const router = express.Router();
const middlewares = require('../config/middleware');
const adminController = require('../controllers/admin');

router.get(
  '/add-employee-page',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsAdmin],
  adminController.addEmployeePage
);
router.post(
  '/add-employee',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsAdmin],
  adminController.addEmployee
);
router.get(
  '/update-employee-list',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsAdmin],
  adminController.updateEmployeeList
);
router.get(
  '/view-employees',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsAdmin],
  adminController.employeeList
);

module.exports = router;
