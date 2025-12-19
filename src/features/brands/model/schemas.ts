import { z } from "zod";
import {
  statusSchema,
  pageResponseSchema,
  type BaseFilterParams,
} from "@/shared/api/schemas";


export const BRAND_CONSTANTS = Object.freeze({
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 120,
  },
  LOGO_URL: {
    MAX_LENGTH: 400,
  },
  DESCRIPTION: {
    MAX_LENGTH: 255,
  },
  SORT_FIELDS: ["id", "name", "createdAt", "updatedAt"] as const,
} as const);


export const brandSchema = z.object({
  id: z.number(),
  name: z.string(),
  logoUrl: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  status: statusSchema,
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});


export const brandsResponseSchema = pageResponseSchema(brandSchema);


export const createBrandSchema = z.object({
  name: z
    .string()
    .min(
      BRAND_CONSTANTS.NAME.MIN_LENGTH,
      `Name must be at least ${BRAND_CONSTANTS.NAME.MIN_LENGTH} characters`
    )
    .max(
      BRAND_CONSTANTS.NAME.MAX_LENGTH,
      `Name must not exceed ${BRAND_CONSTANTS.NAME.MAX_LENGTH} characters`
    ),
  logoUrl: z
    .string()
    .max(
      BRAND_CONSTANTS.LOGO_URL.MAX_LENGTH,
      `Logo URL must not exceed ${BRAND_CONSTANTS.LOGO_URL.MAX_LENGTH} characters`
    )
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(
      BRAND_CONSTANTS.DESCRIPTION.MAX_LENGTH,
      `Description must not exceed ${BRAND_CONSTANTS.DESCRIPTION.MAX_LENGTH} characters`
    )
    .optional()
    .nullable(),
  status: statusSchema,
});

export const updateBrandSchema = z.object({
  name: z
    .string()
    .min(
      BRAND_CONSTANTS.NAME.MIN_LENGTH,
      `Name must be at least ${BRAND_CONSTANTS.NAME.MIN_LENGTH} characters`
    )
    .max(
      BRAND_CONSTANTS.NAME.MAX_LENGTH,
      `Name must not exceed ${BRAND_CONSTANTS.NAME.MAX_LENGTH} characters`
    ),
  logoUrl: z
    .string()
    .max(
      BRAND_CONSTANTS.LOGO_URL.MAX_LENGTH,
      `Logo URL must not exceed ${BRAND_CONSTANTS.LOGO_URL.MAX_LENGTH} characters`
    )
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(
      BRAND_CONSTANTS.DESCRIPTION.MAX_LENGTH,
      `Description must not exceed ${BRAND_CONSTANTS.DESCRIPTION.MAX_LENGTH} characters`
    )
    .optional()
    .nullable(),
  status: statusSchema,
});

export const updateBrandStatusSchema = z.object({
  status: statusSchema,
});

export const bulkUpdateStatusSchema = z.object({
  ids: z.array(z.number()).min(1, "Select at least one brand"),
  status: statusSchema,
});

export const bulkDeleteSchema = z.object({
  ids: z.array(z.number()).min(1, "Select at least one brand"),
});


export type BrandFilterParams = BaseFilterParams;

export const brandFilterParamsSchema = z.object({
  page: z.number().min(0).default(0),
  size: z.number().min(1).max(100).default(10),
  sortBy: z.enum(BRAND_CONSTANTS.SORT_FIELDS).default("createdAt"),
  sortDir: z.enum(["ASC", "DESC"]).default("DESC"),
  search: z.string().optional(),
  status: z.array(statusSchema).optional(),
});


export type Brand = z.infer<typeof brandSchema>;
export type BrandStatus = z.infer<typeof statusSchema>;
export type BrandsResponse = z.infer<typeof brandsResponseSchema>;

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
export type UpdateBrandStatusInput = z.infer<typeof updateBrandStatusSchema>;
export type BulkUpdateStatusInput = z.infer<typeof bulkUpdateStatusSchema>;
export type BulkDeleteInput = z.infer<typeof bulkDeleteSchema>;
