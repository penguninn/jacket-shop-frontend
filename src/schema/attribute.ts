import { z } from "zod";

export const statusEnum = ["ACTIVE", "INACTIVE"] as const;

// -----------------
// Color Schemas
// -----------------
export const colorSchema = z.object({
  id: z.number(),
  name: z.string(),
  hexCode: z.string(),
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

// -----------------
// Size Schemas
// -----------------
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
