import assert from 'node:assert/strict';
import { loginUser } from '../controllers/authController.js';

const invalidCredentials = [
  { email: null, password: 'Password1' },
  { email: 'user@example.com' },
  { email: {}, password: 'Password1' },
  { email: 'user@example.com', password: [] },
  { email: '   ', password: 'Password1' },
];

for (const body of invalidCredentials) {
  let statusCode;
  let responseBody;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      responseBody = payload;
      return this;
    },
  };

  await loginUser({ body }, res);

  assert.equal(statusCode, 400);
  assert.deepEqual(responseBody, { message: 'Please provide email and password' });
}

console.log('User login credential validation tests passed.');
process.exit(0);
