const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Create a new product
router.post('/createProduct', productController.createProduct);

// Get all products
router.get('/getProducts', productController.getProducts);

module.exports = router;