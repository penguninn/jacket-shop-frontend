import z from "zod";

export const colorStatusEnum = ["ACTIVE", "INACTIVE"] as const;

export const colorSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  status: z.enum(colorStatusEnum),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export type Color = z.infer<typeof colorSchema>;
export type ColorStatus = typeof colorStatusEnum[number];

export const sizeStatusEnum = ["ACTIVE", "INACTIVE"] as const;

export const sizeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  status: z.enum(sizeStatusEnum),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export type Size = z.infer<typeof sizeSchema>;
export type SizeStatus = typeof sizeStatusEnum[number];

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
  description: z.string().optional(),
  status: z.enum(colorStatusEnum),
});

export const updateColorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
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
  description: z.string().optional(),
  status: z.enum(sizeStatusEnum),
});

export const updateSizeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z.enum(sizeStatusEnum),
});

// -----------------
// Feature-specific Types
// -----------------
export type ColorsResponse = z.infer<typeof colorsResponseSchema>;
export type CreateColorInput = z.infer<typeof createColorSchema>;
export type UpdateColorInput = z.infer<typeof updateColorSchema>;

export type SizesResponse = z.infer<typeof sizesResponseSchema>;
export type CreateSizeInput = z.infer<typeof createSizeSchema>;
export type UpdateSizeInput = z.infer<typeof updateSizeSchema>;
