const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middleware/auth');

// All cart routes require authentication
router.use(verifyToken);

// Get user's cart
router.get('/', cartController.getCart);

// Add to cart
router.post('/add', cartController.addToCart);

// Update cart item
router.put('/update', cartController.updateCartItem);

// Remove item from cart
router.delete('/remove/:productId', cartController.removeFromCart);

// Clear cart
router.delete('/clear', cartController.clearCart);

module.exports = router; 