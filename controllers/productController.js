const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

const Product = require("../model/productModel");

//Get All Products 
exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  if (!products || products.length === 0) {
    return next(new AppError("No Products Found", 404));
  }

  res.status(200).json({
    status: "success",
    data: products
  });

});




// Get Products By Category
exports.getProductsByCategory = catchAsync(async (req, res, next) => {
  // Check if a category is provided in the request URL
  const category = req.params.category;
  let products;
  if (category) {
    // If a category is provided, search products by that category
    products = await Product.find({ category: category });
  } else {
    // If no category is provided, return all products
    products = await Product.find();
  }

  // Check if any products are found
  if (!products || products.length === 0) {
    // Return an error if no products are found
    return next(new AppError("No Products Found", 404));
  }
  res.status(200).json({
    status: "success",
    data: products
  });
});
