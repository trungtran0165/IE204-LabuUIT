const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { verifyToken } = require('../middleware/auth');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/stats', blogController.getBlogStats);
router.get('/categories', blogController.getAllCategories);
router.get('/category/:category', blogController.getBlogsByCategory);
router.get('/slug/:slug', blogController.getBlogBySlug);
router.get('/:id', blogController.getBlogById);

// Protected routes
router.post('/', verifyToken, blogController.createBlog);
router.put('/:id', verifyToken, blogController.updateBlog);
router.delete('/:id', verifyToken, blogController.deleteBlog);

module.exports = router; 