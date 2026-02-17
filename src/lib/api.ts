import { baseApiUrl } from "@/config/env";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { sleep } from "./utils";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: baseApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     // Add auth token if available
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// Response interceptor
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<any>) => {
    const config = error.config as RetryConfig | undefined;

    if (!config || config._retry) {
      return Promise.reject(error);
    }

    const errorCode = error.response?.data?.error;

    // ✅ Only retry for this specific backend error
    if (errorCode === "Error_RetryAndLogout") {
      config._retry = true;

      // ⏳ Optional delay (e.g. 500ms)
      await sleep(500);

      return api(config);
    }

    return Promise.reject(error);
  }
);


export default api;
