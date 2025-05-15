const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

//SUB MIDDLEWARE FOR THIS MINI-APPLICATION
const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authController.logOut);
router.post('/signup', authController.signUp);
router.get('/checkout', authController.protect);

router.use(authController.protect);

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
router.get('/me', userController.getMe, userController.getUser);

router.get('/', userController.getAllUsers);

router.get('/:id', userController.getUser);

router.post('/refresh', authController.refreshToken);


router.get(
  '/isLoggedIn',
  authController.isLoggedIn,
  userController.sendCurrentUser,
);

router.patch('/updatePassword', authController.updatePassword);
module.exports = router;
