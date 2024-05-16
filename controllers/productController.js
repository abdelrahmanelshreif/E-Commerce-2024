const factory = require('../controllers/handlerFactory');
const Product = require('../model/productModel');

exports.getAllProducts = factory.getAll(Product);
exports.getProductByID = factory.getOne(Product);
exports.uploadProductPhoto = factory.uploadPhoto('imageCover');
exports.createNewProduct = factory.createOne(Product);
exports.updateProductwithID = factory.updateOne(Product);
exports.deleteProductwithID = factory.deleteOne(Product);
