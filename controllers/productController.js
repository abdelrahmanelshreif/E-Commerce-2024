const factory = require('../controllers/handlerFactory');
const Product = require('../model/productModel');

exports.getAllProducts = factory.getAll(Product);
exports.getProductByID = factory.getOne(Product);
exports.createNewProduct = factory.createOne(Product);
