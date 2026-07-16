import assert from 'node:assert/strict';
import { createWorkerShareData, shareWorkerProfile } from './shareWorkerProfile.js';

const worker = { id: 'worker-1', name: 'Asha', profession: 'Electrician' };
assert.deepEqual(createWorkerShareData(worker, 'https://fixnearby.example'), {
  title: 'Asha on FixNearby',
  text: 'View Asha, Electrician, on FixNearby.',
  url: 'https://fixnearby.example/worker/worker-1',
});

let sharedData;
assert.equal(await shareWorkerProfile({
  worker,
  origin: 'https://fixnearby.example',
  navigatorObject: { share: async (data) => { sharedData = data; } },
}), 'shared');
assert.equal(sharedData.url, 'https://fixnearby.example/worker/worker-1');

let copiedUrl;
assert.equal(await shareWorkerProfile({
  worker,
  origin: 'https://fixnearby.example',
  navigatorObject: { clipboard: { writeText: async (url) => { copiedUrl = url; } } },
}), 'copied');
assert.equal(copiedUrl, 'https://fixnearby.example/worker/worker-1');

console.log('Worker profile sharing tests passed.');
