import { queueRequest } from '../services/offlineQueue';

/**
 * Helper to determine if a request should be queued offline.
 * @param {object} error Axios error object
 * @returns {boolean} True if successfully queued
 */
export const handleOfflineRequest = (error) => {
  if (!navigator.onLine && error.config) {
    const { url, method, data } = error.config;
    queueRequest(url, method, data ? JSON.parse(data) : null);
    return true;
  }
  return false;
};
