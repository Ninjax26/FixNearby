/**
 * Recursively removes keys starting with $ or containing dots to prevent NoSQL query injection attacks.
 */
const clean = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        clean(obj[key]);
      }
    }
  }
  return obj;
};

export const sanitizeRequests = (req, res, next) => {
  req.body = clean(req.body);
  req.query = clean(req.query);
  req.params = clean(req.params);
  next();
};
