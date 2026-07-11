import api from "./apiClient";

/**
 * Fetch the authenticated worker's earnings dashboard stats.
 */
export const getEarningsDashboard = async () => {
  try {
    const response = await api.get("/earnings/dashboard/stats");
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Failed to load earnings dashboard",
      status: error.response?.status,
    };
  }
};

/**
 * Fetch paginated earnings history.
 * @param {{ page?: number, limit?: number, status?: string }} params
 */
export const getEarningsHistory = async (params = {}) => {
  try {
    const response = await api.get("/earnings/history", { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Failed to load earnings history",
      status: error.response?.status,
    };
  }
};

/**
 * Request a payout.
 * @param {number} amount
 */
export const requestPayout = async (amount) => {
  try {
    const response = await api.post("/earnings/payout", { amount });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Failed to request payout",
      status: error.response?.status,
    };
  }
};

export default {
  getEarningsDashboard,
  getEarningsHistory,
  requestPayout,
};
