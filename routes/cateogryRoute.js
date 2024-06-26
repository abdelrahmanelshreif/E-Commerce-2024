const categoryController = require('../controllers/categoryController');

const express = require('express');

const router = express.Router();

router
  .route('/')
  .get(categoryController.getAllCateogries)
  .post(
    categoryController.uploadCategoryImage,
    categoryController.createNewCateogry
  );

module.exports = router;
