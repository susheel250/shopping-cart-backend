const express = require('express');

const router = express.Router();

const productController = require('../controllers/product.controller');
const upload = require('../middleware/upload.middleware');

router.post(
  '/create',
  upload.single('image'),
  productController.createProduct
);

router.get(
  '/list',
  productController.getProducts
);

router.get(
  '/:id',
  productController.getProductById
);

module.exports = router;