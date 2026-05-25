const express = require('express');

const router = express.Router();

const productController = require('../controllers/product.controller');

router.post(
  '/create',
  productController.createProduct
);

router.get(
  '/list',
  productController.getProducts
);

module.exports = router;