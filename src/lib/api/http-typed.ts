import { z } from "zod";
import { toProblem } from "./error";
import { httpPrivate } from "./axios.private";
import { httpPublic } from "./axios.public";

async function parseWithSchema<T extends z.ZodTypeAny>(
  promise: Promise<any>,
  schema: T,
): Promise<z.infer<T>> {
  try {
    const data = await promise;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      throw {
        message: "Invalid server response",
        raw: data,
        cause: parsed.error,
      };
    }
    return parsed.data;
  } catch (e: any) {
    throw toProblem(e);
  }
}

export const httpPublicTyped = {
  get: <T extends z.ZodTypeAny>(url: string, schema: T) =>
    parseWithSchema(httpPublic.get(url), schema),
  post: <T extends z.ZodTypeAny>(url: string, body: any, schema: T) =>
    parseWithSchema(httpPublic.post(url, body), schema),
  put: <T extends z.ZodTypeAny>(url: string, body: any, schema: T) =>
    parseWithSchema(httpPublic.put(url, body), schema),
  del: <T extends z.ZodTypeAny>(url: string, schema: T) =>
    parseWithSchema(httpPublic.del(url), schema),
};

export const httpPrivateTyped = {
  get: <T extends z.ZodTypeAny>(url: string, schema: T) =>
    parseWithSchema(httpPrivate.get(url), schema),
  post: <T extends z.ZodTypeAny>(url: string, body: any, schema: T) =>
    parseWithSchema(httpPrivate.post(url, body), schema),
  put: <T extends z.ZodTypeAny>(url: string, body: any, schema: T) =>
    parseWithSchema(httpPrivate.put(url, body), schema),
  del: <T extends z.ZodTypeAny>(url: string, schema: T) =>
    parseWithSchema(httpPrivate.del(url), schema),
};
