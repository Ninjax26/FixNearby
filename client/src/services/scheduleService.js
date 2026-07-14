import api from "./apiClient";

/**
 * Fetch worker schedule for a date range.
 * @param {{ startDate: string, endDate: string }} params
 */
export const getWorkerSchedule = async (params) => {
  try {
    const response = await api.get("/schedule/", { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Failed to load schedule",
      status: error.response?.status,
    };
  }
};

/**
 * Set recurring weekly availability.
 * @param {{ dayOfWeek: number, startTime: string, endTime: string }[]} slots
 */
export const setRecurringAvailability = async (slots) => {
  try {
    const response = await api.post("/schedule/recurring", { slots });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Failed to update availability",
      status: error.response?.status,
    };
  }
};

/**
 * Block a specific time slot.
 * @param {{ date: string, startTime: string, endTime: string, reason?: string }} data
 */
export const blockTimeSlot = async (data) => {
  try {
    const response = await api.post("/schedule/block", data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Failed to block time slot",
      status: error.response?.status,
    };
  }
};

/**
 * Fetch blocked slots for a date range.
 * @param {{ startDate?: string, endDate?: string }} params
 */
export const getBlockedSlots = async (params = {}) => {
  try {
    const response = await api.get("/schedule/blocked", { params });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Failed to load blocked slots",
      status: error.response?.status,
    };
  }
};

/**
 * Remove a blocked slot by ID.
 * @param {string} id
 */
export const removeBlockedSlot = async (id) => {
  try {
    const response = await api.delete(`/schedule/block/${id}`);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Failed to remove blocked slot",
      status: error.response?.status,
    };
  }
};

export default {
  getWorkerSchedule,
  setRecurringAvailability,
  blockTimeSlot,
  getBlockedSlots,
  removeBlockedSlot,
};
