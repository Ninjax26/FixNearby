import logger from '../utils/logger.js';

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    const logData = {
      requestId: req.requestId,
      method,
      url: originalUrl,
      statusCode,
      duration: `${duration}ms`,
      ip,
      userAgent: req.headers['user-agent'],
      userId: req.user?._id || req.user?.id || null,
      contentLength: res.get('content-length') || 0
    };

    if (statusCode >= 500) {
      logger.error(logData, `[REQ] ${method} ${originalUrl} ${statusCode} ${duration}ms`);
    } else if (statusCode >= 400) {
      logger.warn(logData, `[REQ] ${method} ${originalUrl} ${statusCode} ${duration}ms`);
    } else if (duration > 2000) {
      logger.warn({ ...logData, slow: true }, `[REQ] ${method} ${originalUrl} ${statusCode} ${duration}ms (SLOW)`);
    } else {
      logger.info(logData, `[REQ] ${method} ${originalUrl} ${statusCode} ${duration}ms`);
    }
  });

  next();
};

export default requestLogger;
