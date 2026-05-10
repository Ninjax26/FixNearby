import api from "./apiClient";

export const workerSignup = async (data) => {
  try {
    const res = await api.post("/workers/register", data);
    return res.data;
  } catch (error) {
    console.error(error.response?.data?.message || error);
    throw {
      message: error.response?.data?.message || "Registration failed",
      status: error.response?.status,
    };
  }
};

export const fetchWorkers = async () => {
  try {
    const res = await api.get("/workers");
    return res.data;
  } catch (error) {
    console.error(error.response?.data?.message || error);
    throw {
      message: error.response?.data?.message || "Failed to fetch workers",
      status: error.response?.status,
    };
  }
};
