const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');

router.use('/users', require('./users'));

router.use('/admin', require('./admin'));

router.use('/employee', require('./employee'));

router.get('/', homeController.home);

module.exports = router;
