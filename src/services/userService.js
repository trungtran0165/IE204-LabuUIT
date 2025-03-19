const User = require('../models/User');
const BaseService = require('./baseService');

class UserService extends BaseService {
    /**
     * Get all users
     */
    async getAllUsers() {
        try {
            return await User.find().select('-password');
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(id) {
        try {
            const user = await User.findById(id).select('-password');
            if (!user) {
                throw this.createError('User not found', 404);
            }
            return user;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Update user
     */
    async updateUser(id, updateData) {
        try {
            const user = await User.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
                throw this.createError('User not found', 404);
            }

            return user;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Delete user
     */
    async deleteUser(id) {
        try {
            const user = await User.findByIdAndDelete(id);

            if (!user) {
                throw this.createError('User not found', 404);
            }

            return { success: true };
        } catch (error) {
            this.handleError(error);
        }
    }
}

module.exports = new UserService();
