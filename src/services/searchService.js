const Product = require('../models/Product');
const Blog = require('../models/Blog');
const Category = require('../models/Category');
const BaseService = require('./baseService');

class SearchService extends BaseService {
    /**
     * Search products by query
     */
    async searchProducts(query, options = {}) {
        try {
            const page = parseInt(options.page) || 1;
            const limit = parseInt(options.limit) || 10;
            const skip = (page - 1) * limit;

            const searchQuery = {
                $text: { $search: query },
                // Only show active products
                active: true
            };

            // Filter by category if provided
            if (options.category) {
                searchQuery.category = options.category;
            }

            // Filter by price range if provided
            if (options.minPrice || options.maxPrice) {
                searchQuery.price = {};

                if (options.minPrice) {
                    searchQuery.price.$gte = parseFloat(options.minPrice);
                }

                if (options.maxPrice) {
                    searchQuery.price.$lte = parseFloat(options.maxPrice);
                }
            }

            // Add score field for text search relevance
            const products = await Product.find(searchQuery, {
                score: { $meta: "textScore" }
            })
                .sort({ score: { $meta: "textScore" } })
                .skip(skip)
                .limit(limit)
                .populate('category', 'name slug');

            const total = await Product.countDocuments(searchQuery);

            return {
                products,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Search blogs by query
     */
    async searchBlogs(query, options = {}) {
        try {
            const page = parseInt(options.page) || 1;
            const limit = parseInt(options.limit) || 10;
            const skip = (page - 1) * limit;

            const searchQuery = {
                $text: { $search: query },
                // Only show published blogs
                published: true
            };

            // Filter by category if provided
            if (options.category) {
                searchQuery.categories = options.category;
            }

            // Filter by tag if provided
            if (options.tag) {
                searchQuery.tags = options.tag;
            }

            // Add score field for text search relevance
            const blogs = await Blog.find(searchQuery, {
                score: { $meta: "textScore" }
            })
                .sort({ score: { $meta: "textScore" } })
                .skip(skip)
                .limit(limit)
                .populate('author', 'name');

            const total = await Blog.countDocuments(searchQuery);

            return {
                blogs,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Universal search across multiple collections
     */
    async universalSearch(query, options = {}) {
        try {
            // Use Promise.all to run searches in parallel
            const [productsResult, blogsResult] = await Promise.all([
                this.searchProducts(query, { ...options, limit: 5 }),
                this.searchBlogs(query, { ...options, limit: 5 })
            ]);

            return {
                products: productsResult.products,
                blogs: blogsResult.blogs,
                query
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get search suggestions
     */
    async getSearchSuggestions(query) {
        try {
            if (!query || query.length < 2) {
                return [];
            }

            // Get product name suggestions
            const productSuggestions = await Product.find(
                {
                    $text: { $search: query },
                    active: true
                },
                { score: { $meta: "textScore" } }
            )
                .sort({ score: { $meta: "textScore" } })
                .limit(5)
                .select('name slug');

            // Get category suggestions
            const categorySuggestions = await Category.find(
                { $text: { $search: query } },
                { score: { $meta: "textScore" } }
            )
                .sort({ score: { $meta: "textScore" } })
                .limit(3)
                .select('name slug');

            // Get blog title suggestions
            const blogSuggestions = await Blog.find(
                {
                    $text: { $search: query },
                    published: true
                },
                { score: { $meta: "textScore" } }
            )
                .sort({ score: { $meta: "textScore" } })
                .limit(3)
                .select('title slug');

            // Combine suggestions
            const suggestions = [
                ...productSuggestions.map(p => ({
                    text: p.name,
                    type: 'product',
                    slug: p.slug
                })),
                ...categorySuggestions.map(c => ({
                    text: c.name,
                    type: 'category',
                    slug: c.slug
                })),
                ...blogSuggestions.map(b => ({
                    text: b.title,
                    type: 'blog',
                    slug: b.slug
                }))
            ];

            // Sort by relevance and limit to 10 results
            return suggestions
                .sort((a, b) => {
                    // Simple string matching for relevance
                    const aStartsWithQuery = a.text.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0;
                    const bStartsWithQuery = b.text.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0;

                    return bStartsWithQuery - aStartsWithQuery;
                })
                .slice(0, 10);
        } catch (error) {
            this.handleError(error);
        }
    }
}

module.exports = new SearchService(); 