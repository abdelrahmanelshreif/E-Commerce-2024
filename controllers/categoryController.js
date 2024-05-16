const factory = require('../controllers/handlerFactory');
const Category = require('../model/cateogryModel');

exports.createNewCateogry = factory.createOne(Category);
exports.uploadCategoryImage = factory.uploadPhoto('image');
exports.getAllCateogries = factory.getAll(Category);
