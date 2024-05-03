const productController = require('../controllers/productController'); 
const handlerFactory = require('../controllers/handlerFactory'); 
const express = require('express');

const router = express.Router();

//Get All Products
router.get('/', productController.getAllProducts);
//Get Product by ID
router.get('/:id', handlerFactory.getOne);

//Get Products Belonging To Same Cateogry
router.get('/{category}',productController.getProductsByCategory);


module.exports = router;