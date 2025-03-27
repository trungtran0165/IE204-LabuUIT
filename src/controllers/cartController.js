const cartService = require('../services/cartService');

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const cart = await cartService.getCart(req.user.id);

        res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to retrieve cart',
            error: error.status ? undefined : error.message
        });
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const cart = await cartService.addToCart(
            req.user.id,
            productId,
            quantity ? parseInt(quantity) : 1
        );

        res.status(200).json({
            success: true,
            message: 'Item added to cart',
            cart
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to add item to cart',
            error: error.status ? undefined : error.message
        });
    }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and quantity are required'
            });
        }

        const cart = await cartService.updateCartItem(
            req.user.id,
            productId,
            parseInt(quantity)
        );

        res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            cart
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to update cart',
            error: error.status ? undefined : error.message
        });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const cart = await cartService.removeFromCart(req.user.id, productId);

        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            cart
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to remove item from cart',
            error: error.status ? undefined : error.message
        });
    }
};

// Clear cart (remove all items)
exports.clearCart = async (req, res) => {
    try {
        const cart = await cartService.clearCart(req.user.id);

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            cart
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to clear cart',
            error: error.status ? undefined : error.message
        });
    }
}; 