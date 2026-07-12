import crypto from 'crypto';

/**
 * Generates a cryptographically secure random token for CSRF protection.
 * @returns {string}
 */
export const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex');
};
