const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();


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


// Adminstrator Features On User Protection
router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)


router
  .route('/:id')
  .get(userController.getUserWithId)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;