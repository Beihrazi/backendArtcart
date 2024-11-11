const errorMiddleware = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500; // Default to 500 if no status code is set
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Optionally hide stack trace in production
    });
};

module.exports = errorMiddleware;