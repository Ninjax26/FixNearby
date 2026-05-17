import api from "./apiClient";

export const signupUser = async (data) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    console.error(error.response?.data?.message || error);
    throw {
      message: error.response?.data?.message || "Registration failed",
      status: error.response?.status,
    };
  }
};

export const loginUser = async (data) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error) {
    console.error(error.response?.data?.message || error);
    throw {
      message: error.response?.data?.message || "Login failed",
      status: error.response?.status,
    };
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch (error) {
    console.error(error.response?.data?.message || error);
    throw {
      message: error.response?.data?.message || "failed to fetch profile",
      status: error.response?.status,
    };
  }
};
