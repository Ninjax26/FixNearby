import assert from 'node:assert/strict';
import { buildUserDataExport } from '../controllers/authController.js';

const exported = buildUserDataExport({
  _id: '507f1f77bcf86cd799439011',
  name: 'Test User',
  email: 'test@example.com',
  phone: '9876543210',
  role: 'customer',
  status: 'offline',
  notificationPreferences: { email: true, sms: false, push: true },
  password: 'must-not-export',
  resetPasswordToken: 'must-not-export',
}, new Date('2026-07-17T00:00:00.000Z'));

assert.equal(exported.schemaVersion, 1);
assert.equal(exported.exportedAt, '2026-07-17T00:00:00.000Z');
assert.equal(exported.account.email, 'test@example.com');
assert.equal(exported.account.notificationPreferences.sms, false);
assert.equal('password' in exported.account, false);
assert.equal('resetPasswordToken' in exported.account, false);

console.log('User data export tests passed.');
