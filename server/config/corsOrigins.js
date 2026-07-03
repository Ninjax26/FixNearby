import dotenv from 'dotenv';
dotenv.config();

/**
 * Centralized CORS origin whitelist.
 *
 * Shared between the Express HTTP CORS middleware (server.js) and the
 * Socket.IO server (socket.js) so that both layers enforce the same
 * origin policy.
 *
 * Origins are read from the CLIENT_URL environment variable (comma-
 * separated) and merged with hard-coded development defaults.
 */

const parsedEnvOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(url => url.trim().replace(/\/$/, ''))
  : [];

const allowedOrigins = [
  ...parsedEnvOrigins,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

export default allowedOrigins;
