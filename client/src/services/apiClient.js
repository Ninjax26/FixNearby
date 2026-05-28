import axios from "axios";

const api = axios.create({
    baseURL:`${import.meta.env.VITE_API_URL}`,
    headers:{
        "Content-Type":"application/json"
    },
    timeout:10000
})

// Request interceptor to automatically add the Authorization header
api.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem("fixnearby_user");
      if (raw) {
        const userData = JSON.parse(raw);
        if (userData?.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      }
    } catch (error) {
      console.error("Error reading token from localStorage in apiClient", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;