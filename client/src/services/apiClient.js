import axios from "axios";

const normalizeApiBaseURL = (value) => {
  const baseURL = (value || "http://localhost:5000/api").replace(/\/+$/, "");
  return baseURL.endsWith("/api") ? baseURL : `${baseURL}/api`;
};

const api = axios.create({
   baseURL: normalizeApiBaseURL(import.meta.env.VITE_API_URL),
    headers:{
        "Content-Type":"application/json"
    },
    timeout:10000
})

// Response interceptor for standardized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const raw = localStorage.getItem("fixnearby_user");
      if (raw) {
        try {
          const userData = JSON.parse(raw);
          if (userData?.token) {
            localStorage.removeItem("fixnearby_user");
            window.location.href = "/login";
          }
        } catch {}
      }
    }
    return Promise.reject(error);
  }
);

// Request interceptor to automatically add the Authorization header
api.interceptors.request.use(
  (config) => {
    if (typeof config.url === "string") {
      config.url = config.url.replace(/^\/api(?=\/)/, "");
    }

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
