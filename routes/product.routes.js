const express = require('express');

const router = express.Router();

const productController = require('../controllers/product.controller');
const upload = require('../middleware/upload.middleware');
const { verifyToken } = require('../middleware/auth.middleware');
const { adminMiddleware } = require('../middleware/admin.middleware');

router.post(
  '/create',
  verifyToken,
  adminMiddleware,
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