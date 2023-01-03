const express = require('express');
const router = express.Router();
const middlewares = require('../config/middleware');
const employeeController = require('../controllers/employee');

router.get(
  '/view-reviews',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsEmployee],
  employeeController.viewReviews
);

router.get(
  '/review-feedback-page/:id',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsEmployee],
  employeeController.feedbackPage
);

router.post(
  '/feedback-review/:id',
  [middlewares.checkUserAuthentication, middlewares.checkIfUserIsEmployee],
  employeeController.submitFeedback
);

module.exports = router;
