const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const express = require('express');
const cartRouter = require('./cartRoutes');

const router = express.Router();
router.use('/:productID/cart', cartRouter);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    productController.uploadProductPhoto,
    productController.createNewProduct
  );
router.use(authController.protect);
router.use(authController.restrictTo('admin'));
router
  .route('/:id')
  .get(productController.getProductByID)
  .patch(
    productController.uploadProductPhoto,
    productController.updateProductwithID
  )
  .delete(productController.deleteProductwithID);
module.exports = router;
