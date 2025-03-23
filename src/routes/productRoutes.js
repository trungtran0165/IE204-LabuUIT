const express = require('express');
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Route: /api/products
router.route('/')
    .get(productController.getAllProducts)
    .post(verifyToken, isAdmin, productController.createProduct);

// Route: /api/products/:id
router.route('/:id')
    .get(productController.getProductById)
    .put(verifyToken, isAdmin, productController.updateProduct)
    .delete(verifyToken, isAdmin, productController.deleteProduct);

// Route: /api/products/slug/:slug
router.get('/slug/:slug', productController.getProductBySlug);

// Route: /api/products/category/:categoryId
router.get('/category/:categoryId', productController.getProductsByCategory);

module.exports = router; 