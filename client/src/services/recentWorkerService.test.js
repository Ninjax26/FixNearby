import assert from 'node:assert/strict';
import {
  addRecentWorker,
  clearRecentWorkers,
  getRecentWorkers,
  removeRecentWorker,
} from './recentWorkerService.js';

const values = new Map();
const storage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: (key) => values.delete(key),
};

for (let id = 1; id <= 6; id += 1) {
  addRecentWorker({ id, name: `Worker ${id}` }, storage);
}
assert.deepEqual(getRecentWorkers(storage).map((worker) => worker.id), [6, 5, 4, 3, 2]);

addRecentWorker({ id: 4, name: 'Worker 4 updated' }, storage);
assert.deepEqual(getRecentWorkers(storage).map((worker) => worker.id), [4, 6, 5, 3, 2]);

assert.deepEqual(removeRecentWorker(6, storage).map((worker) => worker.id), [4, 5, 3, 2]);
assert.deepEqual(clearRecentWorkers(storage), []);
assert.deepEqual(getRecentWorkers(storage), []);

storage.setItem('recentWorkers', '{invalid json');
assert.deepEqual(getRecentWorkers(storage), []);

console.log('Recent worker service tests passed.');
