const express = require('express');
const router = express.Router();
const whislistController = require('../controllers/whislistController');
const authController = require('../controllers/authController');


router.use(authController.protect);

router.get('/', whislistController.getWishlist);
router.post('/add', whislistController.addToWishlist);
router.patch('/remove/:productId', whislistController.deleteFromWishlist);

module.exports = router;
