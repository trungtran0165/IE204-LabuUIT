const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Product search
router.get('/products', searchController.searchProducts);

// Blog search
router.get('/blogs', searchController.searchBlogs);

// Universal search (search across all content)
router.get('/universal', searchController.universalSearch);

// Search suggestions (autocomplete)
router.get('/suggestions', searchController.getSearchSuggestions);

module.exports = router; 