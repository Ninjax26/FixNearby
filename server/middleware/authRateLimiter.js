// middleware/authRateLimiter.js

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