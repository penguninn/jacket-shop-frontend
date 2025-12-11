// shared/api/axios.public.ts
import axios, { AxiosError, type AxiosInstance } from "axios";
import { toProblem } from "./error";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const TIMEOUT = 15000;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: TIMEOUT,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(toProblem(error));
  }
);

export const axiosPublic = axiosInstance;
