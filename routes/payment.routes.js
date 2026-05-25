const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/auth.middleware');

const verifyToken = authMiddleware.verifyToken;

// Create a payment intent
router.post(
  '/create-checkout-session',
  verifyToken,
  paymentController.createCheckoutSession
);

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.stripeWebhook
);

module.exports = router;