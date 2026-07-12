import api from './apiClient';

/**
 * Fetch nearby issues within a radius
 * @param {Object} params
 * @param {number} params.latitude - Center latitude
 * @param {number} params.longitude - Center longitude
 * @param {string} params.category - Issue category filter
 * @param {number} params.radiusKm - Search radius in kilometers
 * @returns {Promise<Array<Object>>} - Array of nearby issues
 */
export async function getNearbyIssues({ latitude, longitude, category, radiusKm }) {
  try {
    const response = await api.get('/issues/nearby', {
      params: {
        lat: latitude,
        lng: longitude,
        category,
        radius: radiusKm
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby issues:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch nearby issues'
    );
  }
}

/**
 * Submit a new issue
 * @param {Object} issueData - Issue data including location, category, description, image
 * @param {string} issueData.title - Issue title
 * @param {string} issueData.description - Issue description
 * @param {string} issueData.category - Issue category
 * @param {number} issueData.latitude - Issue latitude
 * @param {number} issueData.longitude - Issue longitude
 * @param {File} [issueData.imageFile] - Optional image file
 * @returns {Promise<Object>} - Created issue object
 */
export async function createIssue(issueData) {
  try {
    const formData = new FormData();
    formData.append('title', issueData.title);
    formData.append('description', issueData.description);
    formData.append('category', issueData.category);
    formData.append('latitude', issueData.latitude);
    formData.append('longitude', issueData.longitude);
    
    if (issueData.imageFile) {
      formData.append('image', issueData.imageFile);
    }

    const response = await api.post('/issues', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating issue:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to create issue'
    );
  }
}

/**
 * Upvote an existing issue
 * @param {string} issueId - Issue ID to upvote
 * @returns {Promise<Object>} - Updated issue object with new upvote count
 */
export async function upvoteIssue(issueId) {
  try {
    const response = await api.post(`/issues/${issueId}/upvote`);
    return response.data;
  } catch (error) {
    console.error('Error upvoting issue:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to upvote issue'
    );
  }
}

/**
 * Get issue details by ID
 * @param {string} issueId - Issue ID
 * @returns {Promise<Object>} - Issue object
 */
export async function getIssueById(issueId) {
  try {
    const response = await api.get(`/issues/${issueId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching issue:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch issue'
    );
  }
}

/**
 * Fetch all issues
 * @returns {Promise<Array<Object>>} - Array of all issues
 */
export async function getAllIssues() {
  try {
    const response = await api.get('/issues');
    return response.data;
  } catch (error) {
    console.error('Error fetching issues:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch issues'
    );
  }
}
