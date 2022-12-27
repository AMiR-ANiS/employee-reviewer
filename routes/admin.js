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

router.get(
  '/update-page/:id',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsAdmin],
  adminController.updatePage
);

router.post(
  '/update-employee/:id',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsAdmin],
  adminController.updateEmployee
);

router.get(
  '/remove-employee-list',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsAdmin],
  adminController.removeEmployeeList
);

router.get(
  '/remove-employee/:id',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsAdmin],
  adminController.removeEmployee
);

module.exports = router;
