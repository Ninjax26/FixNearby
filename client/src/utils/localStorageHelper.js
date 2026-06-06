/**
 * Safe local storage service helper that prevents serialization errors
 * and gracefully falls back if localStorage is disabled or quota is exceeded.
 */
const localStorageHelper = {
  /**
   * Set item in localStorage with safety checks
   */
  setItem(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      window.localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.warn(`[LocalStorage] Error setting key "${key}":`, error);
      return false;
    }
  },

  /**
   * Get parsed item from localStorage
   */
  getItem(key, fallback = null) {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return fallback;
      return JSON.parse(item);
    } catch (error) {
      console.warn(`[LocalStorage] Error parsing key "${key}":`, error);
      return fallback;
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem(key) {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[LocalStorage] Error removing key "${key}":`, error);
      return false;
    }
  },

  /**
   * Clear all localStorage items
   */
  clear() {
    try {
      window.localStorage.clear();
      return true;
    } catch (error) {
      console.warn('[LocalStorage] Error clearing storage:', error);
      return false;
    }
  }
};

export default localStorageHelper;
