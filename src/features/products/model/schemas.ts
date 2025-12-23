import { z } from "zod";
import {
  statusSchema,
  pageResponseSchema,
  type BaseFilterParams,
} from "@/shared/api/schemas";


export const PRODUCT_CONSTANTS = Object.freeze({
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200,
  },
  DESCRIPTION: {
    MAX_LENGTH: 5000, // Text field, generous limit
  },
  SORT_FIELDS: ["id", "name", "price", "createdAt", "updatedAt", "soldCount"] as const,
} as const);


export const brandResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  logoUrl: z.string().nullable().optional(),
  description: z.string().nullable().optional(), // Added based on API response
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


export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  brand: brandResponseSchema,
  style: styleResponseSchema,
  description: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),

  // New fields from spec
  isFeatured: z.boolean().nullish().transform((v) => v ?? false),
  soldCount: z.number().nullish().transform((v) => v ?? 0),
  ratingAverage: z.number().nullish().transform((v) => v ?? 0.00),
  ratingCount: z.number().nullish().transform((v) => v ?? 0),

  minPrice: z.number().nullish().transform((v) => v ?? 0),
  maxPrice: z.number().nullish().transform((v) => v ?? 0),

  // Nested attribute arrays from API
  colors: z.array(z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().optional(),
    hexCode: z.string().optional(),
    status: statusSchema,
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })).optional().default([]),

  sizes: z.array(z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().optional(),
    status: statusSchema,
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })).optional().default([]),

  materials: z.array(z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().optional(),
    status: statusSchema,
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })).optional().default([]),

  status: statusSchema,
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});


export const productsResponseSchema = pageResponseSchema(productSchema);
export const brandsResponseSchema = pageResponseSchema(brandResponseSchema);
export const stylesResponseSchema = pageResponseSchema(styleResponseSchema);


export const createProductSchema = z.object({
  name: z
    .string()
    .min(
      PRODUCT_CONSTANTS.NAME.MIN_LENGTH,
      `Name must be at least ${PRODUCT_CONSTANTS.NAME.MIN_LENGTH} characters`
    )
    .max(PRODUCT_CONSTANTS.NAME.MAX_LENGTH, `Name must be at most ${PRODUCT_CONSTANTS.NAME.MAX_LENGTH} characters`),
  brandId: z.number().min(1, "Brand is required"),
  styleId: z.number().min(1, "Style is required"),
  description: z.string().max(PRODUCT_CONSTANTS.DESCRIPTION.MAX_LENGTH, "Description is too long").optional(),
  thumbnail: z.string().optional(),
  status: statusSchema,
  isFeatured: z.boolean(),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(
      PRODUCT_CONSTANTS.NAME.MIN_LENGTH,
      `Name must be at least ${PRODUCT_CONSTANTS.NAME.MIN_LENGTH} characters`
    )
    .max(PRODUCT_CONSTANTS.NAME.MAX_LENGTH, `Name must be at most ${PRODUCT_CONSTANTS.NAME.MAX_LENGTH} characters`),
  brandId: z.number().optional(),
  styleId: z.number().optional(),
  description: z.string().max(PRODUCT_CONSTANTS.DESCRIPTION.MAX_LENGTH, "Description is too long").optional(),
  thumbnail: z.string().optional(),
  status: statusSchema.optional(),
  isFeatured: z.boolean().optional(),
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


export interface ProductFilterParams extends BaseFilterParams {
  brandIds?: number[];
  styleIds?: number[];
  colorIds?: number[];
  sizeIds?: number[];
  materialIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
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
  colorIds: z.array(z.number()).optional(),
  sizeIds: z.array(z.number()).optional(),
  materialIds: z.array(z.number()).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  isFeatured: z.boolean().optional(),
});


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
