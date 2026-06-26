const cache = new Map();

export const cacheMiddleware = (durationInSeconds) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse && cachedResponse.expire > Date.now()) {
      return res.status(200).json(cachedResponse.data);
    }

    // Wrap res.json to capture response
    const originalJson = res.json;
    res.json = function (body) {
      cache.set(key, {
        data: body,
        expire: Date.now() + durationInSeconds * 1000
      });
      return originalJson.call(this, body);
    };

    next();
  };
};
