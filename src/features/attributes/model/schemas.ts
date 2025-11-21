import { z } from "zod";
import { colorSchema, colorStatusEnum, sizeSchema, sizeStatusEnum } from "@/entities";

// -----------------
// Color Response & Input Schemas
// -----------------
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
  status: z.enum(colorStatusEnum),
});

export const updateColorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  hexCode: z.string().min(1, "Hex code is required"),
  status: z.enum(colorStatusEnum),
});

// -----------------
// Size Response & Input Schemas
// -----------------
export const sizesResponseSchema = z.object({
  contents: z.array(sizeSchema),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

export const createSizeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(sizeStatusEnum),
});

export const updateSizeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(sizeStatusEnum),
});

// -----------------
// Re-export Types from Entities
// -----------------
export type { Color, ColorStatus, Size, SizeStatus } from "@/entities";

// -----------------
// Feature-specific Types
// -----------------
export type ColorsResponse = z.infer<typeof colorsResponseSchema>;
export type CreateColorInput = z.infer<typeof createColorSchema>;
export type UpdateColorInput = z.infer<typeof updateColorSchema>;

export type SizesResponse = z.infer<typeof sizesResponseSchema>;
export type CreateSizeInput = z.infer<typeof createSizeSchema>;
export type UpdateSizeInput = z.infer<typeof updateSizeSchema>;
