const express = require('express');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');

//SUB MIDDLEWARE FOR THIS MINI-APPLICATION
const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);
module.exports = router;
