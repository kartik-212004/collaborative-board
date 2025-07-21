import axios from "axios";

const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : "";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HTTP_BACKEND_URL,
  headers: {
    Authorization: token ? "header " + token : "",
  },
});

export default api;
