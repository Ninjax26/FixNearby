/**
 * logger.js
 *
 * Structured JSON logging utility for the FixNearby server.
 *
 * ## Why structured logging?
 * console.log() outputs unformatted strings:
 *   Server running on port 5000
 *
 * Structured loggers output JSON objects:
 *   {"level":"info","time":1717927800000,"pid":1234,"msg":"Server running on port 5000"}
 *
 * JSON logs can be:
 *   - Indexed and queried in log aggregation platforms (Datadog, Grafana Loki,
 *     AWS CloudWatch Logs Insights, Elastic/ELK).
 *   - Filtered by severity level in production.
 *   - Correlated across microservices using `requestId` fields.
 *   - Parsed by automated alerting rules.
 *
 * ## Pino
 * Pino is the fastest JSON logger in the Node.js ecosystem — benchmarks show
 * it is ~5× faster than Winston and ~10× faster than Bunyan for synchronous
 * log writes.  It achieves this via asynchronous write buffering and a minimal
 * serialization path.
 *
 * ## Configuration
 * The logger reads the NODE_ENV and LOG_LEVEL environment variables:
 *
 *   NODE_ENV=development  → pretty-print logs (human readable, coloured)
 *   NODE_ENV=production   → raw JSON (machine readable, parseable)
 *   LOG_LEVEL             → override the default level ('info')
 *
 * ## Usage
 *
 *   import logger from './utils/logger.js';
 *
 *   logger.info('Server started', { port: 5000 });
 *   logger.warn('Rate limit hit', { ip: '1.2.3.4', route: '/api/auth/login' });
 *   logger.error({ err }, 'Database connection failed');
 *
 * ## Adding request logging
 * Use pino-http for automatic request/response logging:
 *
 *   import pinoHttp from 'pino-http';
 *   app.use(pinoHttp({ logger }));
 *
 * ## Installation
 * pino is a peer dependency that must be installed:
 *
 *   npm install pino
 *   npm install --save-dev pino-pretty   # for human-readable dev output
 */

/**
 * Fallback logger used when pino is not yet installed.
 * Produces JSON-compatible output so log parsers don't break during the
 * transition period before the package is installed.
 */
const consoleFallback = {
  info:  (...args) => console.log(JSON.stringify({ level: 'info',  msg: args.join(' '), time: Date.now() })),
  warn:  (...args) => console.warn(JSON.stringify({ level: 'warn',  msg: args.join(' '), time: Date.now() })),
  error: (...args) => console.error(JSON.stringify({ level: 'error', msg: args.join(' '), time: Date.now() })),
  debug: (...args) => console.debug(JSON.stringify({ level: 'debug', msg: args.join(' '), time: Date.now() })),
  fatal: (...args) => console.error(JSON.stringify({ level: 'fatal', msg: args.join(' '), time: Date.now() })),
};

/**
 * Create and export the application-wide logger instance.
 *
 * Dynamic import is used so the module remains loadable (and the application
 * can start) even if pino has not been installed yet.  The consoleFallback
 * is used in that case, providing the same API surface.
 */
let logger;

try {
  const { default: pino } = await import('pino');

  const isDev = process.env.NODE_ENV !== 'production';
  const level = process.env.LOG_LEVEL || 'info';

  logger = pino({
    level,
    ...(isDev && {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
    }),

    serializers: {
      err: pino.stdSerializers.err,
      error: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    },

    redact: {
      paths: ['req.headers.authorization', 'req.headers.cookie', 'body.password', 'body.token', 'body.secret'],
      censor: '[REDACTED]'
    },
  });
} catch {
  // pino not installed — use the JSON-compat console fallback.
  console.warn(
    '[logger] pino not found, using console fallback. Run: npm install pino pino-pretty'
  );
  logger = consoleFallback;
}

export default logger;
