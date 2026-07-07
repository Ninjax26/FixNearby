import { generateCsrfToken } from '../utils/csrfHelper.js';

export const csrfProtection = (req, res, next) => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  
  // 1. Generate CSRF Token if not present in cookies
  let csrfToken = req.headers.cookie?.split('; ')
    .find(row => row.startsWith('csrf-token='))
    ?.split('=')[1];

  if (!csrfToken) {
    csrfToken = generateCsrfToken();
  }

  // Set cookie for client consumption
  res.cookie('csrf-token', csrfToken, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });

  // 2. Bypass validation for safe HTTP methods
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // 3. For state-changing requests, match header with cookie
  const headerToken = req.headers['x-csrf-token'];
  
  if (!headerToken || headerToken !== csrfToken) {
    return res.status(403).json({
      success: false,
      message: 'CSRF token validation failed'
    });
  }

  next();
};

export default csrfProtection;
