const searchService = require('../services/searchService');

// Search products
exports.searchProducts = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const result = await searchService.searchProducts(q, req.query);

        res.status(200).json({
            success: true,
            data: result.products,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Search failed',
            error: error.status ? undefined : error.message
        });
    }
};

// Search blogs
exports.searchBlogs = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const result = await searchService.searchBlogs(q, req.query);

        res.status(200).json({
            success: true,
            data: result.blogs,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Search failed',
            error: error.status ? undefined : error.message
        });
    }
};

// Universal search (search across different collections)
exports.universalSearch = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const result = await searchService.universalSearch(q, req.query);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Search failed',
            error: error.status ? undefined : error.message
        });
    }
};

// Get search suggestions
exports.getSearchSuggestions = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.status(200).json({
                success: true,
                suggestions: []
            });
        }

        const suggestions = await searchService.getSearchSuggestions(q);

        res.status(200).json({
            success: true,
            suggestions
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to get search suggestions',
            error: error.status ? undefined : error.message
        });
    }
}; 