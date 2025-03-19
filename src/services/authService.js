const User = require('../models/User');
const jwt = require('jsonwebtoken');
const BaseService = require('./baseService');
require('dotenv').config();

class AuthService extends BaseService {
    /**
     * Register a new user
     */
    async register(userData) {
        try {
            const { name, email, password } = userData;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw this.createError('User with this email already exists', 400);
            }

            // Create a new user
            const user = new User({
                name,
                email,
                password
            });

            await user.save();

            // Generate token
            const token = this.generateToken(user._id);

            return {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Login user
     */
    async login(credentials) {
        try {
            const { email, password } = credentials;

            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                throw this.createError('Invalid email or password', 401);
            }

            // Check if password is correct
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                throw this.createError('Invalid email or password', 401);
            }

            // Generate token
            const token = this.generateToken(user._id);

            return {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get user profile by ID
     */
    async getUserProfile(userId) {
        try {
            const user = await User.findById(userId).select('-password');
            if (!user) {
                throw this.createError('User not found', 404);
            }

            return user;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Generate JWT token
     */
    generateToken(userId) {
        return jwt.sign(
            { id: userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
    }
}

module.exports = new AuthService();
