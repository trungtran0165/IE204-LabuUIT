const categoryService = require('../services/categoryService');

// Tạo danh mục mới
exports.createCategory = async (req, res) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Cập nhật danh mục
exports.updateCategory = async (req, res) => {
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
    try {
        const result = await categoryService.deleteCategory(req.params.id);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy tất cả danh mục
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy danh mục theo ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy danh mục theo slug
exports.getCategoryBySlug = async (req, res) => {
    try {
        const category = await categoryService.getCategoryBySlug(req.params.slug);
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
}; 