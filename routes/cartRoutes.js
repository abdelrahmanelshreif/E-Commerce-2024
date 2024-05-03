const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const express = require('express');

const router = express.Router({ mergeParams: true });
router.use(authController.protect);

router
  .route('/')
  .get(cartController.getUsersCarts)
  .delete(cartController.dropCart);
router.patch('/item/:itemID', cartController.updateCartItem);
router.post('/addToCart', cartController.addToCart);
router.post('/removefromCart', cartController.RemoveCartItem);
router.delete('/dropCart', userController.getMe, cartController.dropCart);
module.exports = router;
