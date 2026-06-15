import axios, { type AxiosError } from "axios";

/**
 * Base URL for the JSON Server backend.
 * Override with VITE_API_BASE_URL when needed.
 */
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:3001";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — placeholder for auth tokens if added later.
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors into Error(message).
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Network error. Is the API server running?";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
