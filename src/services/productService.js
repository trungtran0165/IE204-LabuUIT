const Product = require('../models/Product');
const Category = require('../models/Category');
const BaseService = require('./baseService');

class ProductService extends BaseService {
    /**
     * Tạo sản phẩm mới
     */
    async createProduct(productData) {
        try {
            const { name, description, price, stock, images, category } = productData;

            // Kiểm tra danh mục có tồn tại không
            const existingCategory = await Category.findById(category);
            if (!existingCategory) {
                throw this.createError('Danh mục không tồn tại', 404);
            }

            // Tạo sản phẩm mới
            const product = new Product({
                name,
                description,
                price,
                stock,
                images,
                category
            });

            await product.save();
            return product;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Cập nhật sản phẩm
     */
    async updateProduct(productId, updateData) {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                throw this.createError('Không tìm thấy sản phẩm', 404);
            }

            // Nếu cập nhật danh mục, kiểm tra danh mục mới có tồn tại không
            if (updateData.category) {
                const existingCategory = await Category.findById(updateData.category);
                if (!existingCategory) {
                    throw this.createError('Danh mục không tồn tại', 404);
                }
            }

            // Cập nhật thông tin
            Object.keys(updateData).forEach(key => {
                product[key] = updateData[key];
            });

            await product.save();
            return product;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Xóa sản phẩm
     */
    async deleteProduct(productId) {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                throw this.createError('Không tìm thấy sản phẩm', 404);
            }

            await Product.findByIdAndDelete(productId);
            return { message: 'Sản phẩm đã được xóa thành công' };
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Lấy tất cả sản phẩm với phân trang và sắp xếp
     */
    async getAllProducts(query = {}) {
        try {
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const skip = (page - 1) * limit;
            const sortBy = query.sortBy || 'createdAt';
            const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
            
            const sort = {};
            sort[sortBy] = sortOrder;

            const filter = {};
            if (query.search) {
                filter.name = { $regex: query.search, $options: 'i' };
            }
            
            // Sản phẩm có sẵn
            if (query.available === 'true') {
                filter.isAvailable = true;
            }

            const products = await Product.find(filter)
                .populate('category', 'name slug')
                .sort(sort)
                .skip(skip)
                .limit(limit);

            const total = await Product.countDocuments(filter);

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
     * Lấy thông tin sản phẩm theo ID
     */
    async getProductById(productId) {
        try {
            const product = await Product.findById(productId).populate('category', 'name slug');
            if (!product) {
                throw this.createError('Không tìm thấy sản phẩm', 404);
            }
            return product;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Lấy thông tin sản phẩm theo slug
     */
    async getProductBySlug(slug) {
        try {
            const product = await Product.findOne({ slug }).populate('category', 'name slug');
            if (!product) {
                throw this.createError('Không tìm thấy sản phẩm', 404);
            }
            return product;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Lấy sản phẩm theo danh mục
     */
    async getProductsByCategory(categoryId, query = {}) {
        try {
            // Kiểm tra danh mục có tồn tại không
            const existingCategory = await Category.findById(categoryId);
            if (!existingCategory) {
                throw this.createError('Danh mục không tồn tại', 404);
            }

            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const skip = (page - 1) * limit;
            const sortBy = query.sortBy || 'createdAt';
            const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
            
            const sort = {};
            sort[sortBy] = sortOrder;

            const filter = { category: categoryId };
            if (query.search) {
                filter.name = { $regex: query.search, $options: 'i' };
            }
            
            // Sản phẩm có sẵn
            if (query.available === 'true') {
                filter.isAvailable = true;
            }

            const products = await Product.find(filter)
                .populate('category', 'name slug')
                .sort(sort)
                .skip(skip)
                .limit(limit);

            const total = await Product.countDocuments(filter);

            return {
                category: {
                    id: existingCategory._id,
                    name: existingCategory.name,
                    slug: existingCategory.slug
                },
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
}

module.exports = new ProductService(); 