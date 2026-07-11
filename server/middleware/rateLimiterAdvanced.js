import rateLimit from 'express-rate-limit';

const createHandler = (message, retryAfter) => {
  return (req, res) => {
    res.status(429).json({
      success: false,
      message,
      retryAfter: retryAfter || 60,
      limit: req.rateLimit?.max,
      remaining: req.rateLimit?.remaining,
      resetTime: req.rateLimit?.resetTime
    });
  };
};

export const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createHandler('Too many requests. Please slow down.', 60)
});

export const moderateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createHandler('Too many requests. Please slow down.', 60)
});

export const generousLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createHandler('Too many requests.', 60)
});

export const burstLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createHandler('Too many requests in quick succession. Please wait a few seconds.', 10),
  skip: (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return false;
    try {
      const token = authHeader.split(' ')[1];
      return token && token.length > 20;
    } catch {
      return false;
    }
  }
});

export const createTieredLimiter = (tiers) => {
  return (req, res, next) => {
    const matched = tiers.find(t => {
      if (t.condition && !t.condition(req)) return false;
      return true;
    });
    const config = matched || tiers[tiers.length - 1];
    const limiter = rateLimit({
      windowMs: config.windowMs || 60 * 1000,
      max: config.max || 10,
      standardHeaders: true,
      legacyHeaders: false,
      handler: createHandler(config.message || 'Rate limit exceeded', Math.ceil((config.windowMs || 60000) / 1000))
    });
    return limiter(req, res, next);
  };
};

export default {
  strictLimiter,
  moderateLimiter,
  generousLimiter,
  burstLimiter,
  createTieredLimiter
};
