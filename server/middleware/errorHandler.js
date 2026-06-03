/**
 * Global Express error handling middleware.
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error stack trace in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error] ${err.message}`, err.stack);
  }

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export default errorHandler;
