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

export const sanitizeInput = (req, res, next) => {
  const cleanData = (data) => {
    if (typeof data === 'string') {
      return data.replace(/[<>]/g, '');
    }
    if (typeof data === 'object' && data !== null) {
      for (const key in data) {
        if (key.startsWith('$') || key.includes('.')) {
          delete data[key];
        } else {
          data[key] = cleanData(data[key]);
        }
      }
    }
    return data;
  };

  if (req.body) req.body = cleanData(req.body);
  if (req.query) req.query = cleanData(req.query);
  if (req.params) req.params = cleanData(req.params);
  next();
};
