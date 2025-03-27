const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    price: {
        type: Number,
        required: true
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [cartItemSchema],
    totalPrice: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
cartSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Calculate total price before saving
cartSchema.pre('save', function (next) {
    this.totalPrice = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart; 