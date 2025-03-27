const Cart = require('../models/Cart');
const Product = require('../models/Product');
const BaseService = require('./baseService');

class CartService extends BaseService {
    /**
     * Get user's cart
     */
    async getCart(userId) {
        try {
            let cart = await Cart.findOne({ user: userId })
                .populate({
                    path: 'items.product',
                    select: 'name image imageAlt price slug'
                });

            if (!cart) {
                cart = await this.createCart(userId);
            }

            return cart;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Create empty cart for user
     */
    async createCart(userId) {
        try {
            const cart = new Cart({
                user: userId,
                items: [],
                totalPrice: 0
            });

            await cart.save();
            return cart;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Add item to cart
     */
    async addToCart(userId, productId, quantity = 1) {
        try {
            // Find the product
            const product = await Product.findById(productId);
            if (!product) {
                throw this.createError('Product not found', 404);
            }

            // Find user's cart or create if not exists
            let cart = await Cart.findOne({ user: userId });
            if (!cart) {
                cart = await this.createCart(userId);
            }

            // Check if product already in cart
            const itemIndex = cart.items.findIndex(item =>
                item.product.toString() === productId.toString()
            );

            if (itemIndex > -1) {
                // Product exists in cart, update the quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Product not in cart, add it
                cart.items.push({
                    product: productId,
                    quantity: quantity,
                    price: product.price
                });
            }

            await cart.save();

            return await cart.populate({
                path: 'items.product',
                select: 'name image imageAlt price slug'
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Update cart item quantity
     */
    async updateCartItem(userId, productId, quantity) {
        try {
            // Find user's cart
            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                throw this.createError('Cart not found', 404);
            }

            // Find the item in the cart
            const itemIndex = cart.items.findIndex(item =>
                item.product.toString() === productId.toString()
            );

            if (itemIndex === -1) {
                throw this.createError('Item not found in cart', 404);
            }

            if (quantity <= 0) {
                // Remove item if quantity is 0 or negative
                return await this.removeFromCart(userId, productId);
            }

            // Update quantity
            cart.items[itemIndex].quantity = quantity;

            await cart.save();

            return await cart.populate({
                path: 'items.product',
                select: 'name image imageAlt price slug'
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Remove item from cart
     */
    async removeFromCart(userId, productId) {
        try {
            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                throw this.createError('Cart not found', 404);
            }

            // Remove the item
            cart.items = cart.items.filter(item =>
                item.product.toString() !== productId.toString()
            );

            await cart.save();

            return await cart.populate({
                path: 'items.product',
                select: 'name image imageAlt price slug'
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Clear cart (remove all items)
     */
    async clearCart(userId) {
        try {
            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                throw this.createError('Cart not found', 404);
            }

            cart.items = [];
            await cart.save();

            return cart;
        } catch (error) {
            this.handleError(error);
        }
    }
}

module.exports = new CartService(); 