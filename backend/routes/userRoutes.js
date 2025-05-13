const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

//SUB MIDDLEWARE FOR THIS MINI-APPLICATION
const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authController.logOut);
router.post('/signup', authController.signUp);
router.get('/checkout', authController.protect);

router.patch(
  '/updateMe',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);

router.use(authController.protect);

router.get('/isLoggedIn', userController.sendCurrentUser);

router.patch('/updatePassword', authController.updatePassword);

module.exports = router;
