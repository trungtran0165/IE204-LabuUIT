const Category = require('../models/Category');
const BaseService = require('./baseService');

class CategoryService extends BaseService {
    /**
     * Tạo danh mục mới
     */
    async createCategory(categoryData) {
        try {
            const { name, description } = categoryData;

            // Kiểm tra danh mục đã tồn tại chưa
            const existingCategory = await Category.findOne({ name });
            if (existingCategory) {
                throw this.createError('Danh mục với tên này đã tồn tại', 400);
            }

            // Tạo danh mục mới
            const category = new Category({
                name,
                description
            });

            await category.save();
            return category;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Cập nhật danh mục
     */
    async updateCategory(categoryId, updateData) {
        try {
            const category = await Category.findById(categoryId);
            if (!category) {
                throw this.createError('Không tìm thấy danh mục', 404);
            }

            // Nếu thay đổi tên, kiểm tra tên mới đã tồn tại chưa
            if (updateData.name && updateData.name !== category.name) {
                const existingCategory = await Category.findOne({ name: updateData.name });
                if (existingCategory) {
                    throw this.createError('Danh mục với tên này đã tồn tại', 400);
                }
            }

            // Cập nhật thông tin
            Object.keys(updateData).forEach(key => {
                category[key] = updateData[key];
            });

            await category.save();
            return category;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Xóa danh mục
     */
    async deleteCategory(categoryId) {
        try {
            const category = await Category.findById(categoryId);
            if (!category) {
                throw this.createError('Không tìm thấy danh mục', 404);
            }

            await Category.findByIdAndDelete(categoryId);
            return { message: 'Danh mục đã được xóa thành công' };
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Lấy tất cả danh mục
     */
    async getAllCategories() {
        try {
            const categories = await Category.find().sort({ name: 1 });
            return categories;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Lấy thông tin danh mục theo ID
     */
    async getCategoryById(categoryId) {
        try {
            const category = await Category.findById(categoryId);
            if (!category) {
                throw this.createError('Không tìm thấy danh mục', 404);
            }
            return category;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Lấy thông tin danh mục theo slug
     */
    async getCategoryBySlug(slug) {
        try {
            const category = await Category.findOne({ slug });
            if (!category) {
                throw this.createError('Không tìm thấy danh mục', 404);
            }
            return category;
        } catch (error) {
            this.handleError(error);
        }
    }
}

module.exports = new CategoryService(); 