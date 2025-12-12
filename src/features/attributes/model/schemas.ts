import { z } from "zod";
import {
  statusSchema,
  pageResponseSchema,
  type BaseFilterParams,
} from "@/shared/api/schemas";

// ============================================
// CONSTANTS
// ============================================

export const ATTRIBUTE_CONSTANTS = Object.freeze({
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  DESCRIPTION: {
    MAX_LENGTH: 255,
  },
  SORT_FIELDS: ["id", "name", "createdAt", "updatedAt"] as const,
} as const);

// ============================================
// DOMAIN SCHEMAS
// ============================================

export const colorSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: statusSchema,
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const sizeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: statusSchema,
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const materialSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: statusSchema,
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

// ============================================
// RESPONSE SCHEMAS
// ============================================

export const colorsResponseSchema = pageResponseSchema(colorSchema);
export const sizesResponseSchema = pageResponseSchema(sizeSchema);
export const materialsResponseSchema = pageResponseSchema(materialSchema);

// ============================================
// INPUT SCHEMAS
// ============================================

// --- Color ---
export const createColorSchema = z.object({
  name: z
    .string()
    .min(ATTRIBUTE_CONSTANTS.NAME.MIN_LENGTH, "Name is required")
    .max(ATTRIBUTE_CONSTANTS.NAME.MAX_LENGTH, "Name is too long"),
  description: z
    .string()
    .max(ATTRIBUTE_CONSTANTS.DESCRIPTION.MAX_LENGTH, "Description is too long")
    .optional(),
  status: statusSchema,
});

export const updateColorSchema = z.object({
  name: z
    .string()
    .min(ATTRIBUTE_CONSTANTS.NAME.MIN_LENGTH, "Name is required")
    .max(ATTRIBUTE_CONSTANTS.NAME.MAX_LENGTH, "Name is too long"),
  description: z
    .string()
    .max(ATTRIBUTE_CONSTANTS.DESCRIPTION.MAX_LENGTH, "Description is too long")
    .optional(),
  status: statusSchema,
});

export const updateColorStatusSchema = z.object({
  status: statusSchema,
});

export const bulkUpdateStatusColorSchema = z.object({
  ids: z.array(z.number()).min(1, "Select at least one color"),
  status: statusSchema,
});

export const bulkDeleteColorSchema = z.object({
  ids: z.array(z.number()).min(1, "Select at least one color"),
});

// --- Size ---
export const createSizeSchema = z.object({
  name: z
    .string()
    .min(ATTRIBUTE_CONSTANTS.NAME.MIN_LENGTH, "Name is required")
    .max(ATTRIBUTE_CONSTANTS.NAME.MAX_LENGTH, "Name is too long"),
  description: z
    .string()
    .max(ATTRIBUTE_CONSTANTS.DESCRIPTION.MAX_LENGTH, "Description is too long")
    .optional(),
  status: statusSchema,
});

export const updateSizeSchema = z.object({
  name: z
    .string()
    .min(ATTRIBUTE_CONSTANTS.NAME.MIN_LENGTH, "Name is required")
    .max(ATTRIBUTE_CONSTANTS.NAME.MAX_LENGTH, "Name is too long"),
  description: z
    .string()
    .max(ATTRIBUTE_CONSTANTS.DESCRIPTION.MAX_LENGTH, "Description is too long")
    .optional(),
  status: statusSchema,
});

export const updateSizeStatusSchema = z.object({
  status: statusSchema,
});

export const bulkUpdateStatusSizeSchema = z.object({
  ids: z.array(z.number()).min(1, "Select at least one size"),
  status: statusSchema,
});

export const bulkDeleteSizeSchema = z.object({
  ids: z.array(z.number()).min(1, "Select at least one size"),
});

// --- Material ---
export const createMaterialSchema = z.object({
  name: z
    .string()
    .min(ATTRIBUTE_CONSTANTS.NAME.MIN_LENGTH, "Name is required")
    .max(ATTRIBUTE_CONSTANTS.NAME.MAX_LENGTH, "Name is too long"),
  description: z
    .string()
    .max(ATTRIBUTE_CONSTANTS.DESCRIPTION.MAX_LENGTH, "Description is too long")
    .optional(),
  status: statusSchema,
});

export const updateMaterialSchema = z.object({
  name: z
    .string()
    .min(ATTRIBUTE_CONSTANTS.NAME.MIN_LENGTH, "Name is required")
    .max(ATTRIBUTE_CONSTANTS.NAME.MAX_LENGTH, "Name is too long"),
  description: z
    .string()
    .max(ATTRIBUTE_CONSTANTS.DESCRIPTION.MAX_LENGTH, "Description is too long")
    .optional(),
  status: statusSchema,
});

export const updateMaterialStatusSchema = z.object({
  status: statusSchema,
});

export const bulkUpdateStatusMaterialSchema = z.object({
  ids: z.array(z.number()).min(1, "Select at least one material"),
  status: statusSchema,
});

export const bulkDeleteMaterialSchema = z.object({
  ids: z.array(z.number()).min(1, "Select at least one material"),
});

// ============================================
// FILTER PARAMS SCHEMA
// ============================================

export interface AttributeFilterParams extends BaseFilterParams { }

export const attributeFilterParamsSchema = z.object({
  page: z.number().min(0).default(0),
  size: z.number().min(1).max(100).default(10),
  sortBy: z.enum(ATTRIBUTE_CONSTANTS.SORT_FIELDS).default("createdAt"),
  sortDir: z.enum(["ASC", "DESC"]).default("DESC"),
  search: z.string().optional(),
  status: z.array(statusSchema).optional(),
});

// ============================================
// TYPESCRIPT TYPES
// ============================================

export type Color = z.infer<typeof colorSchema>;
export type ColorStatus = z.infer<typeof statusSchema>;
export type ColorsResponse = z.infer<typeof colorsResponseSchema>;

export type Size = z.infer<typeof sizeSchema>;
export type SizeStatus = z.infer<typeof statusSchema>;
export type SizesResponse = z.infer<typeof sizesResponseSchema>;

export type Material = z.infer<typeof materialSchema>;
export type MaterialStatus = z.infer<typeof statusSchema>;
export type MaterialsResponse = z.infer<typeof materialsResponseSchema>;

// Input Types
export type CreateColorInput = z.infer<typeof createColorSchema>;
export type UpdateColorInput = z.infer<typeof updateColorSchema>;
export type UpdateColorStatusInput = z.infer<typeof updateColorStatusSchema>;
export type BulkUpdateStatusColorInput = z.infer<typeof bulkUpdateStatusColorSchema>;
export type BulkDeleteColorInput = z.infer<typeof bulkDeleteColorSchema>;

export type CreateSizeInput = z.infer<typeof createSizeSchema>;
export type UpdateSizeInput = z.infer<typeof updateSizeSchema>;
export type UpdateSizeStatusInput = z.infer<typeof updateSizeStatusSchema>;
export type BulkUpdateStatusSizeInput = z.infer<typeof bulkUpdateStatusSizeSchema>;
export type BulkDeleteSizeInput = z.infer<typeof bulkDeleteSizeSchema>;

export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;
export type UpdateMaterialInput = z.infer<typeof updateMaterialSchema>;
export type UpdateMaterialStatusInput = z.infer<typeof updateMaterialStatusSchema>;
export type BulkUpdateStatusMaterialInput = z.infer<typeof bulkUpdateStatusMaterialSchema>;
export type BulkDeleteMaterialInput = z.infer<typeof bulkDeleteMaterialSchema>;
