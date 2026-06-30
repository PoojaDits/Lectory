import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * Base URL for the NestJS backend.
 * Backend main.ts uses app.setGlobalPrefix('api'), so the default includes /api.
 * Override in .env with: VITE_API_BASE_URL=http://localhost:3000/api
 */
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:3000/api";

const ACCESS_TOKEN_KEY = "lectory-access-token";
const REFRESH_TOKEN_KEY = "lectory-refresh-token";

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

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

let refreshPromise: Promise<RefreshTokenResponse> | null = null;

const readRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
};

const refreshTokens = async (): Promise<RefreshTokenResponse> => {
  const refreshToken = readRefreshToken();
  if (!refreshToken) throw new Error("Refresh token missing. Please login again.");

  if (!refreshPromise) {
    refreshPromise = axios
      .post<RefreshTokenResponse>(
        `${API_BASE_URL}/auth/refresh`,
        { refresh_token: refreshToken },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => response.data)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

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

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableAxiosRequestConfig | undefined;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url ?? "";
    const isRefreshRequest = requestUrl.includes("/auth/refresh");

    if (status === 401 && originalRequest && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        const tokens = await refreshTokens();
        useAuthStore.getState().setTokens({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        });

        originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;
        return apiClient(originalRequest as AxiosRequestConfig);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(
          refreshError instanceof Error
            ? refreshError
            : new Error("Session expired. Please login again.")
        );
      }
    }

    const message = getErrorMessage(
      error.response?.data,
      error.message || "Network error. Is the NestJS API server running?"
    );
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
