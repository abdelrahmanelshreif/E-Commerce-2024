const express = require('express');
const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');
const cartRouter = require('./cartRoutes');

const router = express.Router();

//cart Routes
router.use('/:userID/cart', cartRouter);

//SIGN UP - LOGIN
router.post('/signup', authController.signup);
router.post('/login', authController.login);

//FORGET PASSWROD
router.post('/forgetPassword', authController.forgetPassword);
router.post(
  '/resetVerification',
  authController.verifyUserEmailvCodeToResetPassword
);
//CHANGING PASSWORD AFTER SENDING RESET TOKEN
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);
router.patch('/updateMe', userController.updateMe);
router.patch('/updateMyPassword', authController.updatePassword);
router.delete('/deleteMe', userController.deleteMe);

//GETTING USER DATA
router.get('/me', userController.getMe, userController.getUser);
router
  .route('/cart')
  .get(userController.getMe, cartController.getCart);

// Adminstrator Features On User Protection
router.use(authController.restrictTo('admin'));
router.route('/').get(userController.getAllUsers);
// .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
