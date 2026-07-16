const STORAGE_KEY = 'recentWorkers';
const MAX_RECENT_WORKERS = 5;

const getWorkerId = (worker) => worker?._id || worker?.id;

export const getRecentWorkers = (storage = globalThis.localStorage) => {
  if (!storage) return [];

  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(getWorkerId).slice(0, MAX_RECENT_WORKERS) : [];
  } catch {
    storage.removeItem(STORAGE_KEY);
    return [];
  }
};

export const addRecentWorker = (worker, storage = globalThis.localStorage) => {
  const workerId = getWorkerId(worker);
  if (!workerId || !storage) return getRecentWorkers(storage);

  const updated = [
    worker,
    ...getRecentWorkers(storage).filter((item) => getWorkerId(item) !== workerId),
  ].slice(0, MAX_RECENT_WORKERS);

  storage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const removeRecentWorker = (workerId, storage = globalThis.localStorage) => {
  if (!storage) return [];
  const updated = getRecentWorkers(storage).filter((worker) => getWorkerId(worker) !== workerId);
  storage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearRecentWorkers = (storage = globalThis.localStorage) => {
  storage?.removeItem(STORAGE_KEY);
  return [];
};
