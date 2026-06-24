const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error console warning in development
  console.error(`[ERROR LOG]: ${err.stack || err.message}`);

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = { message, statusCode: 404 };
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  const statusCode = error.statusCode || 500;
  const responseMessage = (statusCode === 500 && process.env.NODE_ENV === 'production')
    ? 'Internal Server Error'
    : (error.message || 'Server Error');

  res.status(statusCode).json({
    success: false,
    message: responseMessage
  });
};

export default errorHandler;
