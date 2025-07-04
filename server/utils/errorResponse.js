class ErrorResponse extends Error {
    /**
     * Create a new ErrorResponse instance
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP status code
     * @param {Object} [errorData={}] - Additional error data
     * @param {string} [errorData.code] - Error code for programmatic handling
     * @param {string} [errorData.docs] - Link to documentation
     * @param {Object} [errorData.metadata] - Additional metadata about the error
     */
    constructor(message, statusCode = 500, errorData = {}) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        this.code = errorData.code || 'ERROR';
        this.docs = errorData.docs || null;
        this.metadata = errorData.metadata || {};
        this.timestamp = new Date().toISOString();
        this.isOperational = true; // Mark as operational error (trusted error)

        // Capture stack trace, excluding constructor call from it
        Error.captureStackTrace(this, this.constructor);
        
        // Log the error for debugging in development
        if (process.env.NODE_ENV === 'development') {
            console.error(`[${this.timestamp}] ${this.name}: ${message}`, {
                statusCode,
                code: this.code,
                ...errorData
            });
        }
    }

    /**
     * Convert error to JSON for API responses
     * @returns {Object} JSON representation of the error
     */
    toJSON() {
        return {
            success: false,
            error: {
                name: this.name,
                message: this.message,
                statusCode: this.statusCode,
                code: this.code,
                ...(this.docs && { docs: this.docs }),
                ...(Object.keys(this.metadata).length > 0 && { metadata: this.metadata }),
                ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
            },
            timestamp: this.timestamp
        };
    }

    /**
     * Create a 400 Bad Request error
     * @param {string} message - Error message
     * @param {Object} [errorData] - Additional error data
     * @returns {ErrorResponse} Bad Request error
     */
    static badRequest(message = 'Bad Request', errorData = {}) {
        return new ErrorResponse(message, 400, {
            code: 'BAD_REQUEST',
            ...errorData
        });
    }

    /**
     * Create a 401 Unauthorized error
     * @param {string} [message='Not authorized'] - Error message
     * @param {Object} [errorData] - Additional error data
     * @returns {ErrorResponse} Unauthorized error
     */
    static unauthorized(message = 'Not authorized', errorData = {}) {
        return new ErrorResponse(message, 401, {
            code: 'UNAUTHORIZED',
            ...errorData
        });
    }

    /**
     * Create a 403 Forbidden error
     * @param {string} [message='Forbidden'] - Error message
     * @param {Object} [errorData] - Additional error data
     * @returns {ErrorResponse} Forbidden error
     */
    static forbidden(message = 'Forbidden', errorData = {}) {
        return new ErrorResponse(message, 403, {
            code: 'FORBIDDEN',
            ...errorData
        });
    }

    /**
     * Create a 404 Not Found error
     * @param {string} resource - Name of the resource not found
     * @param {Object} [errorData] - Additional error data
     * @returns {ErrorResponse} Not Found error
     */
    static notFound(resource = 'Resource', errorData = {}) {
        return new ErrorResponse(`${resource} not found`, 404, {
            code: 'NOT_FOUND',
            ...errorData
        });
    }

    /**
     * Create a 409 Conflict error
     * @param {string} [message='Conflict'] - Error message
     * @param {Object} [errorData] - Additional error data
     * @returns {ErrorResponse} Conflict error
     */
    static conflict(message = 'Conflict', errorData = {}) {
        return new ErrorResponse(message, 409, {
            code: 'CONFLICT',
            ...errorData
        });
    }

    /**
     * Create a 422 Unprocessable Entity error
     * @param {string} [message='Validation error'] - Error message
     * @param {Object} [errorData] - Additional error data
     * @returns {ErrorResponse} Validation error
     */
    static validationError(message = 'Validation error', errorData = {}) {
        return new ErrorResponse(message, 422, {
            code: 'VALIDATION_ERROR',
            ...errorData
        });
    }

    /**
     * Create a 500 Internal Server Error
     * @param {string} [message='Internal Server Error'] - Error message
     * @param {Object} [errorData] - Additional error data
     * @returns {ErrorResponse} Internal Server Error
     */
    static serverError(message = 'Internal Server Error', errorData = {}) {
        return new ErrorResponse(message, 500, {
            code: 'INTERNAL_SERVER_ERROR',
            ...errorData
        });
    }
}

export default ErrorResponse;
