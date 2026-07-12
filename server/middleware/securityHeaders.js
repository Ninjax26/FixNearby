/**
 * Additional security headers beyond what Helmet provides.
 * - Referrer-Policy: limits referrer data leakage
 * - Permissions-Policy: restricts browser feature access
 * - X-Content-Type-Options: prevents MIME sniffing
 * - Strict-Transport-Security: enforces HTTPS (production only)
 */
const securityHeaders = (req, res, next) => {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self), interest-cohort=()');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '0');

  next();
};

export default securityHeaders;
