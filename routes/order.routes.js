const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');

const verifyToken = authMiddleware.verifyToken;
// Place an order
router.post(
  '/create',
  verifyToken,
  orderController.createOrder
);


module.exports = router;