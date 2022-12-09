const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');

router.use('/users', require('./users'));
router.get('/', homeController.home);

module.exports = router;
