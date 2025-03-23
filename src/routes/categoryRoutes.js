const express = require('express');
const categoryController = require('../controllers/categoryController');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Route: /api/categories
router.route('/')
    .get(categoryController.getAllCategories)
    .post(verifyToken, isAdmin, categoryController.createCategory);

// Route: /api/categories/:id
router.route('/:id')
    .get(categoryController.getCategoryById)
    .put(verifyToken, isAdmin, categoryController.updateCategory)
    .delete(verifyToken, isAdmin, categoryController.deleteCategory);

// Route: /api/categories/slug/:slug
router.get('/slug/:slug', categoryController.getCategoryBySlug);

module.exports = router; 