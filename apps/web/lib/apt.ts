import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
