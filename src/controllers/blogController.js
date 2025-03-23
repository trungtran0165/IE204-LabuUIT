const blogService = require('../services/blogService');

// Create a new blog post
exports.createBlog = async (req, res) => {
    try {
        // Add current user as author
        const blogData = {
            ...req.body,
            author: req.user.id
        };

        const blog = await blogService.createBlog(blogData);

        res.status(201).json({
            success: true,
            message: 'Blog post created successfully',
            blog
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to create blog post',
            error: error.status ? undefined : error.message
        });
    }
};

// Get all blog posts with pagination and filtering
exports.getAllBlogs = async (req, res) => {
    try {
        const result = await blogService.getAllBlogs(req.query);

        res.status(200).json({
            success: true,
            data: result.blogs,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to retrieve blog posts',
            error: error.status ? undefined : error.message
        });
    }
};

// Get a single blog post by ID
exports.getBlogById = async (req, res) => {
    try {
        const blog = await blogService.getBlogById(req.params.id);

        res.status(200).json({
            success: true,
            blog
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to retrieve blog post',
            error: error.status ? undefined : error.message
        });
    }
};

// Get a single blog post by slug (SEO friendly URL)
exports.getBlogBySlug = async (req, res) => {
    try {
        const blog = await blogService.getBlogBySlug(req.params.slug);

        res.status(200).json({
            success: true,
            blog
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to retrieve blog post',
            error: error.status ? undefined : error.message
        });
    }
};

// Update a blog post
exports.updateBlog = async (req, res) => {
    try {
        // Check blog ownership in a middleware or here if needed

        const blog = await blogService.updateBlog(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Blog post updated successfully',
            blog
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to update blog post',
            error: error.status ? undefined : error.message
        });
    }
};

// Delete a blog post
exports.deleteBlog = async (req, res) => {
    try {
        // Check blog ownership in a middleware or here if needed

        await blogService.deleteBlog(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Blog post deleted successfully'
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to delete blog post',
            error: error.status ? undefined : error.message
        });
    }
};

// Get blog stats
exports.getBlogStats = async (req, res) => {
    try {
        const stats = await blogService.getBlogStats();

        res.status(200).json({
            success: true,
            stats
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to retrieve blog stats',
            error: error.status ? undefined : error.message
        });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await blogService.getAllCategories();

        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to retrieve categories',
            error: error.status ? undefined : error.message
        });
    }
};

// Get blogs by category
exports.getBlogsByCategory = async (req, res) => {
    try {
        const result = await blogService.getBlogsByCategory(req.params.category, req.query);

        res.status(200).json({
            success: true,
            data: result.blogs,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to retrieve blogs by category',
            error: error.status ? undefined : error.message
        });
    }
}; 