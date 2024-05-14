const factory = require('../controllers/handlerFactory');
const Brand = require('../model/brandModel');


exports.createNewBrand = factory.createOne(Brand);
exports.getAllBrands = factory.getAll(Brand);

