const factory = require('../controllers/handlerFactory');
const Brand = require('../model/brandModel');

exports.createNewBrand = factory.createOne(Brand);
exports.uploadBrandImage = factory.uploadPhoto('image');
exports.getAllBrands = factory.getAll(Brand);
