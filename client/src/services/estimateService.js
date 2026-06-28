import api from "./apiClient";

const BASE_URL = "/api/estimates";

/**
 * Preview estimate based on inputs
 * @param {string} workerId
 * @param {object} inputs
 */
export const previewEstimate = async (workerId, inputs) => {
  const response = await api.post(`${BASE_URL}/preview`, { workerId, inputs });
  return response.data; // { success, profession, inputs, breakdown }
};

/**
 * Confirm and save estimate
 * @param {string} workerId
 * @param {object} inputs
 */
export const confirmEstimate = async (workerId, inputs) => {
  const response = await api.post(`${BASE_URL}/confirm`, { workerId, inputs });
  return response.data; // { success, message, estimate }
};
