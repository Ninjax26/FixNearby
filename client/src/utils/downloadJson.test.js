import assert from 'node:assert/strict';
import { downloadJson } from './downloadJson.js';

let clicked = false;
let revokedUrl;
const anchor = { click: () => { clicked = true; } };
const documentObject = { createElement: () => anchor };
const urlObject = {
  createObjectURL: () => 'blob:test-export',
  revokeObjectURL: (url) => { revokedUrl = url; },
};

downloadJson({
  data: { account: { name: 'Test User' } },
  filename: 'account.json',
  documentObject,
  urlObject,
});

assert.equal(anchor.download, 'account.json');
assert.equal(anchor.href, 'blob:test-export');
assert.equal(clicked, true);
assert.equal(revokedUrl, 'blob:test-export');

console.log('JSON download tests passed.');
