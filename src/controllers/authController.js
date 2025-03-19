const authService = require('../services/authService');

// Register a new user
exports.register = async (req, res) => {
    try {
        const result = await authService.register(req.body);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token: result.token,
            user: result.user
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Registration failed',
            error: error.status ? undefined : error.message
        });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const result = await authService.login(req.body);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: result.token,
            user: result.user
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Login failed',
            error: error.status ? undefined : error.message
        });
    }
};

// Logout user (primarily client-side, but can invalidate token on server if needed)
exports.logout = async (req, res) => {
    // In a stateless JWT setup, actual logout happens on the client by removing the token
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await authService.getUserProfile(req.user.id);

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Error fetching profile',
            error: error.status ? undefined : error.message
        });
    }
};
