import api from './apiClient';

const QUEUE_KEY = 'offline-mutations';

export const queueRequest = (url, method, data) => {
  const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  queue.push({ id: Date.now(), url, method, data });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

export const syncOfflineQueue = async () => {
  const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  if (queue.length === 0) return;

  localStorage.removeItem(QUEUE_KEY);

  for (const item of queue) {
    try {
      await api({
        url: item.url,
        method: item.method,
        data: item.data
      });
      console.log(`[OfflineSync] Synced request: ${item.method} ${item.url}`);
    } catch (err) {
      console.error(`[OfflineSync] Failed to sync request: ${item.method} ${item.url}`, err);
      // Re-queue on failure
      queueRequest(item.url, item.method, item.data);
    }
  }
};
