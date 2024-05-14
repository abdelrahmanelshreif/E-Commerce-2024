const factory = require('../controllers/handlerFactory');
const express = require('express');

const router = express.Router();

router.route('/:filename').get(factory.accessPhoto);

module.exports = router;
