const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');
const express = require('express');

const router = express.Router();
router.use(authController.protect);

router.route('/addOrder/:id').post(orderController.createOrder);

module.exports = router;
