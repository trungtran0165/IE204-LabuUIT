class BaseService {
    /**
     * Create an error object with status code
     */
    createError(message, statusCode = 500) {
        const error = new Error(message);
        error.status = statusCode;
        return error;
    }

    /**
     * Handle service errors
     */
    handleError(error) {
        // If it's already a structured error, just rethrow it
        if (error.status) {
            throw error;
        }

        // Otherwise create a generic error
        console.error('Service error:', error);
        throw this.createError('An unexpected error occurred', 500);
    }
}

module.exports = BaseService;
