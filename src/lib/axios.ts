import axios, { type AxiosError } from "axios";

/**
 * Base URL for the NestJS backend.
 * Backend main.ts uses app.setGlobalPrefix('api'), so the default includes /api.
 * Override in .env with: VITE_API_BASE_URL=http://localhost:3000/api
 */
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:3000/api";

const ACCESS_TOKEN_KEY = "lectory-access-token";

const getErrorMessage = (data: unknown, fallback: string) => {
  if (!data || typeof data !== "object") return fallback;

  const maybeMessage = (data as { message?: unknown }).message;
  if (Array.isArray(maybeMessage)) return maybeMessage.join("\n");
  if (typeof maybeMessage === "string") return maybeMessage;

  const maybeError = (data as { error?: unknown }).error;
  if (typeof maybeError === "string") return maybeError;

  return fallback;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT access token for protected NestJS routes.
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize backend errors into Error(message), including class-validator arrays.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = getErrorMessage(
      error.response?.data,
      error.message || "Network error. Is the NestJS API server running?"
    );
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
