const Blog = require('../models/Blog');
const BaseService = require('./baseService');

class BlogService extends BaseService {
    /**
     * Create a new blog post
     */
    async createBlog(blogData) {
        try {
            // Generate SEO friendly content if not provided
            if (!blogData.metaTitle) {
                blogData.metaTitle = blogData.title;
            }

            if (!blogData.metaDescription && blogData.content) {
                // Extract first ~160 characters of content for meta description
                const plainContent = blogData.content
                    .replace(/<[^>]*>/g, '') // Remove HTML tags
                    .replace(/\s+/g, ' '); // Normalize whitespace

                blogData.metaDescription = plainContent.substring(0, 160);
                if (plainContent.length > 160) {
                    blogData.metaDescription += '...';
                }
            }

            // Create blog
            const blog = new Blog(blogData);
            await blog.save();
            return blog;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get all blog posts with pagination
     */
    async getAllBlogs(query = {}) {
        try {
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const skip = (page - 1) * limit;

            const filter = {};
            if (query.tags) {
                filter.tags = { $in: Array.isArray(query.tags) ? query.tags : [query.tags] };
            }

            if (query.categories) {
                filter.categories = { $in: Array.isArray(query.categories) ? query.categories : [query.categories] };
            }

            if (query.search) {
                filter.$text = { $search: query.search };
            }

            if (query.author) {
                filter.author = query.author;
            }

            // Only show published blogs unless specifically requested
            filter.published = query.showUnpublished === 'true' ? { $in: [true, false] } : true;

            const blogs = await Blog.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .populate('author', 'name email')
                .exec();

            const total = await Blog.countDocuments(filter);

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
     * Get a blog post by ID
     */
    async getBlogById(id) {
        try {
            const blog = await Blog.findById(id).populate('author', 'name email');
            if (!blog) {
                throw this.createError('Blog post not found', 404);
            }
            return blog;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get a blog post by slug (SEO friendly URL)
     */
    async getBlogBySlug(slug) {
        try {
            const blog = await Blog.findOne({ slug, published: true })
                .populate('author', 'name email');

            if (!blog) {
                throw this.createError('Blog post not found', 404);
            }
            return blog;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Update a blog post
     */
    async updateBlog(id, updateData) {
        try {
            // Set the updatedAt field
            updateData.updatedAt = Date.now();

            // If title is being updated but slug isn't, generate a new slug
            if (updateData.title && !updateData.slug) {
                updateData.slug = updateData.title
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');
            }

            const blog = await Blog.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            ).populate('author', 'name email');

            if (!blog) {
                throw this.createError('Blog post not found', 404);
            }

            return blog;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Delete a blog post
     */
    async deleteBlog(id) {
        try {
            const blog = await Blog.findByIdAndDelete(id);

            if (!blog) {
                throw this.createError('Blog post not found', 404);
            }

            return { success: true };
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get blog stats: count by tag
     */
    async getBlogStats() {
        try {
            const stats = await Blog.aggregate([
                { $match: { published: true } },
                { $unwind: '$tags' },
                { $group: { _id: '$tags', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);

            return stats;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get all categories
     */
    async getAllCategories() {
        try {
            const categories = await Blog.aggregate([
                { $match: { published: true } },
                { $unwind: '$categories' },
                { $group: { _id: '$categories', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);

            return categories;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get blogs by category (for category pages)
     */
    async getBlogsByCategory(category, query = {}) {
        try {
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const skip = (page - 1) * limit;

            const filter = {
                categories: category,
                published: true
            };

            const blogs = await Blog.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .populate('author', 'name email')
                .select('title slug metaDescription image imageAlt createdAt')
                .exec();

            const total = await Blog.countDocuments(filter);

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
}

module.exports = new BlogService(); 