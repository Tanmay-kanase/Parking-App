// /src/utils/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // send cookies if needed
});

// Add a request interceptor to include Authorization token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Adjust the key if stored differently
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
