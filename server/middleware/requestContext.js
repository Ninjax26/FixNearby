import { randomUUID } from 'node:crypto';

export const REQUEST_ID_HEADER = 'X-Request-ID';

// Keep caller-provided IDs log-safe while supporting common UUID, trace, and
// human-readable correlation ID formats.
const REQUEST_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$/;

export const isValidRequestId = (value) => (
  typeof value === 'string' && REQUEST_ID_PATTERN.test(value)
);

export const requestContext = (req, res, next) => {
  const suppliedId = req.get?.(REQUEST_ID_HEADER);
  const requestId = isValidRequestId(suppliedId) ? suppliedId : randomUUID();

  req.requestId = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);
  next();
};

export default requestContext;
