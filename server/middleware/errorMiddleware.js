const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Log the error for server-side debugging
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
        code: err.code,
        keyValue: err.keyValue,
        errors: err.errors
    });
    
    // Prepare error response
    const errorResponse = {
        success: false,
        message: err.message || 'Something went wrong',
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            error: {
                name: err.name,
                code: err.code,
                ...(err.errors && { errors: err.errors }),
                ...(err.keyValue && { keyValue: err.keyValue })
            }
        })
    };
    
    // If this is a validation error, include the validation errors
    if (err.name === 'ValidationError') {
        errorResponse.message = 'Validation failed';
        errorResponse.errors = {};
        
        Object.keys(err.errors).forEach((key) => {
            errorResponse.errors[key] = err.errors[key].message;
        });
    }
    
    res.status(statusCode).json(errorResponse);
};

export { notFound, errorHandler };
