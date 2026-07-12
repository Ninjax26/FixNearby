import dotenv from 'dotenv';
dotenv.config();

/**
 * Centralized CORS origin whitelist.
 *
 * Origins are read from the CLIENT_URL environment variable (comma-
 * separated) and merged with hard-coded development defaults.
 *
 * Each origin is validated to be a well-formed URL before being added
 * to the whitelist, preventing configuration injection attacks.
 */

function isValidOrigin(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

const parsedEnvOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(url => url.trim().replace(/\/$/, '')).filter(isValidOrigin)
  : [];

const allowedOrigins = [
  ...parsedEnvOrigins,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

export function isOriginAllowed(origin) {
  const normalized = origin.replace(/\/$/, '');
  return allowedOrigins.includes(normalized);
}

export default allowedOrigins;
