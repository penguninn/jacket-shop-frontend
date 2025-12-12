import { z } from "zod";
import { axiosPrivate } from "./axios.private";
import { axiosPublic } from "./axios.public";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { ERROR_CODES, type Problem } from "./error";

class HttpTypedClient {

  private axios: AxiosInstance;
  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  private safeParse<T>(data: unknown, schema: z.ZodSchema<T>, url: string): T {
    const result = schema.safeParse(data);

    if (!result.success) {
      if (import.meta.env.DEV) {
        console.group("Schema Validation Failed");
        console.error("Endpoint:", url);
        console.error("Received Data:", data);
        console.table(
          result.error.issues.map((e: z.ZodIssue) => ({
            Path: e.path.join("."),
            Message: e.message,
          }))
        );
        console.groupEnd();
      }

      throw {
        type: "about:blank",
        title: "Schema Validation Error",
        status: 422,
        detail: `Response from ${url} does not match expected schema`,
        instance: url,
        errorCode: ERROR_CODES.SCHEMA_VALIDATION_ERROR,
      } as Problem;
    }

    return result.data;
  }

  async get<T>(url: string, schema: z.ZodSchema<T>, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.get(url, config);
    return this.safeParse(response.data.data, schema, url);
  }

  async post<T>(url: string, data: unknown, schema: z.ZodSchema<T>, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.post(url, data, config);
    return this.safeParse(response.data.data, schema, url);
  }

  async put<T>(url: string, data: unknown, schema: z.ZodSchema<T>, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.put(url, data, config);
    return this.safeParse(response.data.data, schema, url);
  }

  async patch<T>(url: string, data: unknown, schema: z.ZodSchema<T>, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.patch(url, data, config);
    return this.safeParse(response.data.data, schema, url);
  }

  async del<T>(url: string, schema: z.ZodSchema<T>, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.delete(url, config);
    return this.safeParse(response.data.data, schema, url);
  }
}

export const httpPrivateTyped = new HttpTypedClient(axiosPrivate);
export const httpPublicTyped = new HttpTypedClient(axiosPublic);
