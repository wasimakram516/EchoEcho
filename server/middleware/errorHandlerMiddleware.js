const errorHandlerMiddleware = (err, req, res, next) => {
    // Log the error for debugging purposes
    console.error(err);

    // Determine if it is an operational error and use the provided status code
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : "Something went wrong on the server.";

    res.status(statusCode).json({
        error: {
            message: message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

module.exports = errorHandlerMiddleware;
