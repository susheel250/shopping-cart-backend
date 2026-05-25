const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// Create a new category
router.post('/create', categoryController.createCategory);

// Get all categories
router.get('/list', categoryController.getCategories);

module.exports = router;