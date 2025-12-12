import { z } from "zod";
import {
  statusSchema,
  pageResponseSchema,
  type BaseFilterParams,
} from "@/shared/api/schemas";

// ============================================
// CONSTANTS
// ============================================

export const PRODUCT_CONSTANTS = Object.freeze({
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255, // Assuming standard max length
  },
  DESCRIPTION: {
    MAX_LENGTH: 1000, // Assuming standard max length
  },
  SORT_FIELDS: ["id", "name", "price", "createdAt", "updatedAt"] as const,
} as const);

// ============================================
// HELPER SCHEMAS
// ============================================

export const brandResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  logoUrl: z.string().nullable().optional(),
  status: statusSchema,
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const styleResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: statusSchema,
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

// ============================================
// DOMAIN SCHEMAS
// ============================================

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  brand: brandResponseSchema.nullable().optional(),
  description: z.string().nullable().optional(),
  style: styleResponseSchema.nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  imagesJson: z.string().nullable().optional(),
  status: statusSchema,
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

// ============================================
// RESPONSE SCHEMAS
// ============================================

export const productsResponseSchema = pageResponseSchema(productSchema);
export const brandsResponseSchema = pageResponseSchema(brandResponseSchema);
export const stylesResponseSchema = pageResponseSchema(styleResponseSchema);

// ============================================
// INPUT SCHEMAS
// ============================================

export const createProductSchema = z.object({
  name: z
    .string()
    .min(
      PRODUCT_CONSTANTS.NAME.MIN_LENGTH,
      `Name must be at least ${PRODUCT_CONSTANTS.NAME.MIN_LENGTH} characters`
    ),
  brandId: z.number().optional(),
  description: z.string().optional(),
  styleId: z.number().optional(),
  thumbnail: z.string().optional(),
  imagesJson: z.string().optional(),
  status: statusSchema,
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(
      PRODUCT_CONSTANTS.NAME.MIN_LENGTH,
      `Name must be at least ${PRODUCT_CONSTANTS.NAME.MIN_LENGTH} characters`
    ),
  brandId: z.number().optional(),
  description: z.string().optional(),
  styleId: z.number().optional(),
  thumbnail: z.string().optional(),
  imagesJson: z.string().optional(),
  status: statusSchema,
});

export const updateProductStatusSchema = z.object({
  status: statusSchema,
});

export const bulkUpdateStatusProductSchema = z.object({
  ids: z.array(z.number()).min(1, "Select at least one product"),
  status: statusSchema,
});

export const bulkDeleteProductSchema = z.object({
  ids: z.array(z.number()).min(1, "Select at least one product"),
});

// ============================================
// FILTER PARAMS SCHEMA
// ============================================

export interface ProductFilterParams extends BaseFilterParams {
  brandIds?: number[];
  styleIds?: number[];
}

export const productFilterParamsSchema = z.object({
  page: z.number().min(0).default(0),
  size: z.number().min(1).max(100).default(10),
  sortBy: z.enum(PRODUCT_CONSTANTS.SORT_FIELDS).default("createdAt"),
  sortDir: z.enum(["ASC", "DESC"]).default("DESC"),
  search: z.string().optional(),
  status: z.array(statusSchema).optional(),
  brandIds: z.array(z.number()).optional(),
  styleIds: z.array(z.number()).optional(),
});

// ============================================
// TYPESCRIPT TYPES
// ============================================

export type Product = z.infer<typeof productSchema>;
export type ProductStatus = z.infer<typeof statusSchema>;
export type ProductsResponse = z.infer<typeof productsResponseSchema>;

export type Brand = z.infer<typeof brandResponseSchema>;
export type Style = z.infer<typeof styleResponseSchema>;

export type BrandsResponse = z.infer<typeof brandsResponseSchema>;
export type StylesResponse = z.infer<typeof stylesResponseSchema>;

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type UpdateProductStatusInput = z.infer<typeof updateProductStatusSchema>;
export type BulkUpdateStatusProductInput = z.infer<typeof bulkUpdateStatusProductSchema>;
export type BulkDeleteProductInput = z.infer<typeof bulkDeleteProductSchema>;
