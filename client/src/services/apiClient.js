import axios from "axios";
import { getCsrfToken } from "./csrfService";

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

const TIMING_THRESHOLD_SLOW = 3000;

api.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: performance.now() };
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    const startTime = response.config?.metadata?.startTime;
    if (startTime) {
      const duration = performance.now() - startTime;
      const method = (response.config.method || 'GET').toUpperCase();
      const url = response.config.url || '';
      if (duration > TIMING_THRESHOLD_SLOW) {
        console.warn(`[API SLOW] ${method} ${url} took ${duration.toFixed(0)}ms`);
      } else if (process.env.NODE_ENV !== 'production') {
        console.debug(`[API] ${method} ${url} ${duration.toFixed(0)}ms`);
      }
    }
    return response;
  },
  (error) => {
    const startTime = error.config?.metadata?.startTime;
    if (startTime) {
      const duration = performance.now() - startTime;
      const method = (error.config.method || 'GET').toUpperCase();
      const url = error.config.url || '';
      console.error(`[API ERROR] ${method} ${url} failed after ${duration.toFixed(0)}ms`);
    }
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

    const method = config.method?.toUpperCase();
    if (method && !["GET", "HEAD", "OPTIONS"].includes(method)) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
