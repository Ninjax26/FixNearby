import assert from 'node:assert/strict';
import { isValidRequestId, requestContext } from '../middleware/requestContext.js';

const invoke = (suppliedId) => {
  const headers = {};
  let nextCalled = false;
  const req = {
    get: (name) => name === 'X-Request-ID' ? suppliedId : undefined,
  };
  const res = {
    setHeader: (name, value) => {
      headers[name] = value;
    },
  };

  requestContext(req, res, () => {
    nextCalled = true;
  });

  return { requestId: req.requestId, headers, nextCalled };
};

assert.equal(isValidRequestId('checkout-1234'), true);
assert.equal(isValidRequestId('550e8400-e29b-41d4-a716-446655440000'), true);
assert.equal(isValidRequestId('short'), false);
assert.equal(isValidRequestId('unsafe id with spaces'), false);
assert.equal(isValidRequestId('line-break\nvalue'), false);
assert.equal(isValidRequestId('a'.repeat(129)), false);

const preserved = invoke('client-trace-123');
assert.equal(preserved.requestId, 'client-trace-123');
assert.equal(preserved.headers['X-Request-ID'], 'client-trace-123');
assert.equal(preserved.nextCalled, true);

const generated = invoke(undefined);
assert.match(generated.requestId, /^[0-9a-f-]{36}$/);
assert.equal(generated.headers['X-Request-ID'], generated.requestId);

const replaced = invoke('malicious\nheader');
assert.notEqual(replaced.requestId, 'malicious\nheader');
assert.match(replaced.requestId, /^[0-9a-f-]{36}$/);

assert.notEqual(invoke(undefined).requestId, invoke(undefined).requestId);

console.log('Request context verification passed');
