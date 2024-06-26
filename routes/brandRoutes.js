const brandController = require('../controllers/brandController');

const express = require('express');

const router = express.Router();

router
  .route('/')
  .get(brandController.getAllBrands)
  .post(brandController.uploadBrandImage, brandController.createNewBrand);

module.exports = router;
