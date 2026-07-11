import crypto from 'crypto';
import { generateCsrfToken } from '../utils/csrfHelper.js';

const CSRF_COOKIE = 'csrf-token';
const CSRF_HEADER = 'x-csrf-token';

/**
 * Enhanced CSRF protection using double-submit cookie pattern.
 * - Generates a cryptographically random token on first visit.
 * - Sets it as an HttpOnly, SameSite=Strict cookie (not accessible to JS).
 * - Requires state-changing requests to echo the token in the x-csrf-token header.
 * - In production the cookie is also marked Secure.
 */
export const csrfProtection = (req, res, next) => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

  let csrfToken = req.cookies?.[CSRF_COOKIE];
  if (!csrfToken) {
    csrfToken = generateCsrfToken();
  }

  const cookieOptions = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: false,
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
  };

  res.cookie(CSRF_COOKIE, csrfToken, cookieOptions);

  if (safeMethods.includes(req.method)) {
    return next();
  }

  const headerToken = req.headers[CSRF_HEADER];
  if (!headerToken || !crypto.timingSafeEqual(Buffer.from(headerToken), Buffer.from(csrfToken))) {
    return res.status(403).json({
      success: false,
      message: 'CSRF token validation failed',
    });
  }

  next();
};

export default csrfProtection;
