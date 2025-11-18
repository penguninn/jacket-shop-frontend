// src/api/attribute.ts
import { z } from "zod";
import { httpPrivateTyped } from "@/lib/api/http-typed";

// -----------------
// Enums & Schemas
// -----------------
export const statusEnum = ["ACTIVE", "INACTIVE"] as const;

// Color Schemas
export const colorSchema = z.object({
  id: z.number(),
  name: z.string(),
  hexCode: z.string(),
  status: z.enum(statusEnum),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const colorResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  status: z.enum(statusEnum),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const colorsResponseSchema = z.object({
  contents: z.array(colorSchema),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

// Color Create / Update
export const createColorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  hexCode: z.string().min(1, "Hex code is required"),
  status: z.enum(statusEnum),
});

export const updateColorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  hexCode: z.string().min(1, "Hex code is required"),
  status: z.enum(statusEnum),
});

// Size Schemas
export const sizeSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(statusEnum),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const sizesResponseSchema = z.object({
  contents: z.array(sizeSchema),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

// Size Create / Update
export const createSizeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(statusEnum),
});

export const updateSizeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(statusEnum),
});

// -----------------
// Types
// -----------------
export type Color = z.infer<typeof colorSchema>;
export type ColorsResponse = z.infer<typeof colorsResponseSchema>;
export type CreateColorInput = z.infer<typeof createColorSchema>;
export type UpdateColorInput = z.infer<typeof updateColorSchema>;

export type Size = z.infer<typeof sizeSchema>;
export type SizesResponse = z.infer<typeof sizesResponseSchema>;
export type CreateSizeInput = z.infer<typeof createSizeSchema>;
export type UpdateSizeInput = z.infer<typeof updateSizeSchema>;

// -----------------
// Color API
// -----------------
export interface GetColorsParams {
  page: number;
  size: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: string[];
}

export async function getColors(params: GetColorsParams) {
  const qp = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
  });

  if (params.sortBy) qp.append("sortBy", `${params.sortBy},${params.sortOrder || "asc"}`);
  if (params.search) qp.append("search", params.search);
  params.status?.forEach(s => qp.append("status", s));

  return httpPrivateTyped.get(`/colors?${qp.toString()}`, colorsResponseSchema);
}

export async function createColor(payload: CreateColorInput) {
  return httpPrivateTyped.post("/colors", payload, colorSchema);
}

export async function updateColor(id: number, payload: UpdateColorInput) {
  return httpPrivateTyped.put(`/colors/${id}`, payload, colorSchema);
}

export async function deleteColor(id: number) {
  return httpPrivateTyped.del(`/colors/${id}`, z.null());
}

// -----------------
// Size API
// -----------------
export interface GetSizesParams {
  page: number;
  size: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: string[];
}

export async function getSizes(params: GetSizesParams) {
  const qp = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
  });

  if (params.sortBy) qp.append("sortBy", `${params.sortBy},${params.sortOrder || "asc"}`);
  if (params.search) qp.append("search", params.search);
  params.status?.forEach(s => qp.append("status", s));

  return httpPrivateTyped.get(`/sizes?${qp.toString()}`, sizesResponseSchema);
}

export async function createSize(payload: CreateSizeInput) {
  return httpPrivateTyped.post("/sizes", payload, sizeSchema);
}

export async function updateSize(id: number, payload: UpdateSizeInput) {
  return httpPrivateTyped.put(`/sizes/${id}`, payload, sizeSchema);
}

export async function deleteSize(id: number) {
  return httpPrivateTyped.del(`/sizes/${id}`, z.null());
}
