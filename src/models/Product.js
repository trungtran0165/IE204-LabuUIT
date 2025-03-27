const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên sản phẩm là bắt buộc'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Giá sản phẩm là bắt buộc'],
        min: [0, 'Giá sản phẩm không được nhỏ hơn 0']
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'Số lượng tồn kho không được nhỏ hơn 0']
    },
    images: [{
        type: String
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Danh mục sản phẩm là bắt buộc']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Pre-save hook để tạo slug từ name
productSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
});

// Add text index for search functionality
productSchema.index({ name: 'text', description: 'text', shortDescription: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 