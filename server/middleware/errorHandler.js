import logger from '../utils/logger.js';

const CATEGORIES = {
  400: 'VALIDATION',
  401: 'AUTHENTICATION',
  403: 'AUTHORIZATION',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'VALIDATION',
  429: 'RATE_LIMIT',
  500: 'INTERNAL',
  502: 'GATEWAY',
  503: 'UNAVAILABLE'
};

const getCategory = (statusCode) => CATEGORIES[statusCode] || 'UNKNOWN';

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  const requestInfo = {
    requestId: req?.requestId,
    method: req?.method,
    url: req?.originalUrl || req?.url,
    ip: req?.ip,
    userId: req?.user?._id || req?.user?.id || null,
    userAgent: req?.headers?.['user-agent']
  };

  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = { message, statusCode: 404, category: 'NOT_FOUND' };
  } else if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400, category: 'VALIDATION' };
  } else if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400, category: 'VALIDATION' };
  } else if (err.name === 'JsonWebTokenError') {
    const message = 'Not authorized, token validation failed';
    error = { message, statusCode: 401, category: 'AUTHENTICATION' };
  } else if (err.name === 'TokenExpiredError') {
    const message = 'Not authorized, token has expired';
    error = { message, statusCode: 401, category: 'AUTHENTICATION' };
  }

  const statusCode = error.statusCode || 500;
  const category = error.category || getCategory(statusCode);
  const isServerError = statusCode >= 500;

  const logData = {
    category,
    statusCode,
    request: requestInfo,
    ...(isServerError && { stack: err.stack }),
    ...(err.code && { mongoCode: err.code }),
  };

  if (isServerError) {
    logger.error({ err, ...logData }, `[${category}] ${error.message}`);
  } else {
    logger.warn({ ...logData, err: err.message }, `[${category}] ${error.message}`);
  }

  const responseMessage = (statusCode === 500 && process.env.NODE_ENV === 'production')
    ? 'Internal Server Error'
    : (error.message || 'Server Error');

  res.status(statusCode).json({
    success: false,
    message: responseMessage,
    ...(process.env.NODE_ENV !== 'production' && { category })
  });
};

export default errorHandler;
