const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    metaTitle: {
        type: String,
        trim: true
    },
    metaDescription: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    image: {
        type: String,
        default: null
    },
    imageAlt: {
        type: String,
        default: ''
    },
    tags: [{
        type: String,
        trim: true
    }],
    categories: [{
        type: String,
        trim: true
    }],
    published: {
        type: Boolean,
        default: true
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
blogSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.updatedAt = Date.now();
    }
    next();
});

// Generate slug from title if not provided
blogSchema.pre('save', function (next) {
    if (this.isNew && !this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
});

// Add text index for search functionality
blogSchema.index({ title: 'text', content: 'text', tags: 'text', metaDescription: 'text' });
// Add index for slug for faster lookups
blogSchema.index({ slug: 1 });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
