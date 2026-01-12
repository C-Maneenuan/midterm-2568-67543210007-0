// src/presentation/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error('Error:', err.message);
    
    // TODO: Handle different error types
    // - ValidationError → 400
    // - NotFoundError → 404
    // - ConflictError → 409
    // - Default → 500
    
    let statusCode = 500;
    let message = err.message || 'Internal server error';
    
    // Handle specific error types
    switch (err.name) {
        case 'ValidationError':
            statusCode = 400;
            break;
        case 'NotFoundError':
            statusCode = 404;
            break;
        case 'ConflictError':
            statusCode = 409;
            break;
        default:
            if (err.message.includes('required')) {
                statusCode = 400;
            } else if (err.message.includes('not found')) {
                statusCode = 404;
            } else if (err.message.includes('already exists') || err.message.includes('UNIQUE constraint failed')) {
                statusCode = 409;
            }
            break;
    }
    
    res.status(statusCode).json({
        error: message
    });
}

module.exports = errorHandler;