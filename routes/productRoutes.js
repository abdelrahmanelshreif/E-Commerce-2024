const productController = require('../controllers/productController');
const express = require('express');
const cartRouter = require('./cartRoutes');

const router = express.Router();
router.use('/:productID/cart', cartRouter);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.createNewProduct);

router.get('/:id', productController.getProductByID);
module.exports = router;
