const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');


router.use(authController.protect);

router.get('/', cartController.getCart);
router.put('/:productId', cartController.updateProductCount);
router.post('/addToCart', cartController.addToCart);
router.delete('/removeFromCart/:productId', cartController.deleteFromCart);

module.exports = router;
