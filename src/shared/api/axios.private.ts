import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";
import { ERROR_CODES, toProblem } from "./error";
import { authStore } from "@/app/store/auth";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const TIMEOUT = 15000;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: TIMEOUT,
});

// ============================================
// REFRESH TOKEN QUEUE
// ============================================
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// ============================================
// REQUEST INTERCEPTOR
// ============================================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authStore.getAccess();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to refresh token
async function refreshTokenRequest(): Promise<string> {
  try {
    const token = authStore.getRefresh();
    if (!token) throw new Error("No refresh token");

    const response = await axios.post(`${BASE_URL}/api/auth/refresh`, {
      token,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    authStore.setAccess(accessToken);
    if (newRefreshToken) {
      authStore.setRefresh(newRefreshToken);
    }

    return accessToken;
  } catch (error) {
    authStore.clearAll();
    window.dispatchEvent(new Event(ERROR_CODES.AUTH_SESSION_EXPIRED));
    console.log(error);
    throw error;
  }
}

// ============================================
// RESPONSE INTERCEPTOR: Handle 401 & Refresh
// ============================================
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await refreshTokenRequest();
          isRefreshing = false;

          onTokenRefreshed(newToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          return Promise.reject(toProblem(refreshError));
        }
      } else {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            axiosInstance(originalRequest)
              .then(resolve)
              .catch(reject);
          });
        });
      }
    }

    return Promise.reject(toProblem(error));
  }
);

export const axiosPrivate = axiosInstance;
