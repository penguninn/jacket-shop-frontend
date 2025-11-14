import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { toProblem } from "./error";
import { authStore } from "@/store/auth";
const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";
const TIMEOUT = 15000;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: TIMEOUT,
});

axiosInstance.interceptors.request.use((config) => {
  const token = authStore.getAccess();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

function addSubscriber(cb: (token: string) => void) {
  subscribers.push(cb);
}

const raw = axios.create({ baseURL: `${BASE_URL}/api`, timeout: TIMEOUT });

async function refreshTokenRequest() {
  const token = authStore.getRefresh();
  if (!token) throw new Error("No refresh token");
  const res = await raw.post("/auth/refresh", { token });
  const { accessToken, refreshToken: newRefresh } = res.data.data || {};
  if (!accessToken) throw new Error("Invalid refresh response");
  authStore.setAccess(accessToken);
  if (newRefresh) authStore.setRefresh(newRefresh);
  return accessToken as string;
}

axiosInstance.interceptors.response.use(
  (response) => {
    const d = response.data;
    if (d && typeof d === "object" && "data" in d) {
      return d.data;
    }
    return d;
  },
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    console.log(original);
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;
      try {
        if (!isRefreshing) {
          isRefreshing = true;
          const newToken = await refreshTokenRequest();
          isRefreshing = false;
          onRefreshed(newToken);
        } else {
          await new Promise<string>((resolve) => addSubscriber(resolve));
        }
        return axiosInstance(original);
      } catch (e) {
        isRefreshing = false;
        authStore.clearAll();
        return Promise.reject(toProblem(e));
      }
    }
    return Promise.reject(toProblem(error));
  },
);
export const httpPrivate = {
  get: <T>(url: string, cfg?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, cfg),
  post: <T>(url: string, body?: any, cfg?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, body, cfg),
  put: <T>(url: string, body?: any, cfg?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, body, cfg),
  del: <T>(url: string, cfg?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, cfg),
};
