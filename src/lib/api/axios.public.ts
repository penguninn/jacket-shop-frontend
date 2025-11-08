import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { toProblem } from "./error";
const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";
const TIMEOUT = 15000;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: TIMEOUT,
});

axiosInstance.interceptors.response.use(
  (response) => {
    const d = response.data;
    if (d && typeof d === "object" && "data" in d) {
      return d.data;
    }
    return d;
  },
  async (error: AxiosError) => {
    return Promise.reject(toProblem(error));
  },
);
export const httpPublic = {
  get: <T>(url: string, cfg?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, cfg),
  post: <T>(url: string, body?: any, cfg?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, body, cfg),
  put: <T>(url: string, body?: any, cfg?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, body, cfg),
  del: <T>(url: string, cfg?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, cfg),
};
