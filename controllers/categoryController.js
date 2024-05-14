const factory = require('../controllers/handlerFactory');
const Category = require('../model/cateogryModel');


exports.createNewCateogry = factory.createOne(Category);
exports.getAllCateogries = factory.getAll(Category);

