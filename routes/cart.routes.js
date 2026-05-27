const express = require('express');

const router = express.Router();

const cartController = require('../controllers/cart.controller');

const {
  verifyToken
} = require('../middleware/auth.middleware');

// Add to cart
router.post(
  '/add',
  verifyToken,
  cartController.addToCart
);

// Get cart items
router.get(
  '/list',
  verifyToken,
  cartController.getCartItems
);

router.delete(
  '/remove/:id',
  verifyToken,
  cartController.removeCartItem
);

module.exports = router;