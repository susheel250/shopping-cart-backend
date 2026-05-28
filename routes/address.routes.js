const express = require('express');

const router = express.Router();

const authMiddleware =
  require('../middleware/auth.middleware');

const addressController =
  require('../controllers/address.controller');

const verifyToken =
  authMiddleware.verifyToken;

// Add address
router.post(

  '/create',

  verifyToken,

  addressController.createAddress

);

// Get addresses
router.get(

  '/list',

  verifyToken,

  addressController.getAddresses

);

// Set default address
router.put(

  '/set-default/:id',

  verifyToken,

  addressController.setDefaultAddress

);

module.exports = router;