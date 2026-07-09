import api from './apiClient';

/**
 * Fetch stats for the user or worker dashboard.
 * @returns {Promise<Object>} dashboard statistics
 */
export async function getDashboardStats() {
  try {
    const response = await api.get('/workers/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch dashboard stats'
    );
  }
}

export default {
  getDashboardStats
};
