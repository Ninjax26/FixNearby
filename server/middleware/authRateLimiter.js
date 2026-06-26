import rateLimit from "express-rate-limit";

const createRateLimitHandler = (message) => {
  return (req, res) => {
    res.status(429).json({
      success: false,
      message,
    });
  };
};

// Login routes - 5 requests per 15 minutes
export const userLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: createRateLimitHandler(
    "Too many login attempts. Please try again after 15 minutes."
  ),
});

export const workerLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: createRateLimitHandler(
    "Too many worker login attempts. Please try again after 15 minutes."
  ),
});


// Register routes - 5 requests per hour
export const userRegisterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    "Too many registration attempts. Please try again after 1 hour."
  ),
});

export const workerRegisterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    "Too many worker registration attempts. Please try again after 1 hour."
  ),
});

/**
 * Password-reset routes are a frequent brute-force target: an attacker can
 * enumerate valid email addresses or flood the email provider by hammering
 * /forgot-password.  Apply a strict per-IP limiter: 3 requests per 60 minutes
 * is generous for legitimate use (a real user rarely needs more than one
 * reset email per session) while making automated attacks impractical.
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    "Too many password-reset requests from this IP. Please try again after 1 hour."
  ),
});
