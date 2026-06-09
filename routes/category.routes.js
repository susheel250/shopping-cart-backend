const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { adminMiddleware } = require('../middleware/admin.middleware');
const { route } = require('./admin.routes');

// Create a new category
router.post('/create', verifyToken, adminMiddleware, categoryController.createCategory);

// Get all categories
router.get('/list', categoryController.getCategories);

// Update category
router.put('/:id',verifyToken, adminMiddleware, categoryController.updateCategory);

module.exports = router;