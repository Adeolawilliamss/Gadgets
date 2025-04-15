const express = require('express');
const authController = require('../controllers/authController');
const storeController = require('../controllers/storeController');

//SUB MIDDLEWARE FOR THIS MINI-APPLICATION
const router = express.Router();

router.get('/', storeController.getAllCollections);

module.exports = router;
