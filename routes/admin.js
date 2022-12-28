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

router.get(
  '/add-review-list',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsAdmin],
  adminController.addReviewList
);

router.get(
  '/add-review-page/:id',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsAdmin],
  adminController.addReviewPage
);

router.post(
  '/add-review/:id',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsAdmin],
  adminController.addReview
);

router.get(
  '/view-reviews',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsAdmin],
  adminController.viewReviews
);

router.get(
  '/update-review-list',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsAdmin],
  adminController.updateReviewList
);

router.get(
  '/update-review-page/:id',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsAdmin],
  adminController.updateReviewPage
);

router.post(
  '/update-review/:id',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsAdmin],
  adminController.updateReview
);

module.exports = router;
