import api from './apiClient';

/**
 * Search workers with advanced filters
 * @param {Object} params - Search parameters
 * @returns {Promise} Search results
 */
export const searchWorkers = async (params) => {
  try {
    const response = await api.get('/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching workers:', error);
    throw error;
  }
};

/**
 * Get autocomplete suggestions
 * @param {string} query - Search query
 * @returns {Promise} Suggestions array
 */
export const getSearchSuggestions = async (query) => {
  try {
    const response = await api.get('/search/suggestions', {
      params: { q: query },
    });
    return response.data.suggestions || [];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

/**
 * Get popular searches
 * @returns {Promise} Popular searches array
 */
export const getPopularSearches = async () => {
  try {
    const response = await api.get('/search/popular');
    return response.data.popular || [];
  } catch (error) {
    console.error('Error fetching popular searches:', error);
    return [];
  }
};
