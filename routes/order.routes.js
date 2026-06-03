const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { route } = require('./product.routes');

const verifyToken = authMiddleware.verifyToken;
// Place an order
router.post(
  '/create',
  verifyToken,
  orderController.createOrder
);

router.get(
  "/my-orders",

  verifyToken,

  orderController.getMyOrders,
);

router.get(
  "/:id",

  verifyToken,

  orderController.getOrderById,
);


module.exports = router;