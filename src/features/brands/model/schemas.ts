import z from "zod";

// Status enum from backend
export const brandStatusEnum = ["ACTIVE", "INACTIVE"] as const;

// Brand schema based on backend BrandResponse
export const brandSchema = z.object({
  id: z.number(),
  name: z.string(),
  logoUrl: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.enum(brandStatusEnum),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export type Brand = z.infer<typeof brandSchema>;
export type BrandStatus = (typeof brandStatusEnum)[number];

// Paginated response
export const brandsResponseSchema = z.object({
  contents: z.array(brandSchema),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

// Create brand input schema based on BrandRequest
export const createBrandSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(120, "Name must not exceed 120 characters"),
  logoUrl: z
    .string()
    .max(400, "Logo URL must not exceed 400 characters")
    .optional(),
  description: z
    .string()
    .max(255, "Description must be less than 255 characters")
    .optional()
    .nullable(),
  status: z.enum(brandStatusEnum),
});

// Update brand input schema
export const updateBrandSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(120, "Name must not exceed 120 characters"),
  logoUrl: z
    .string()
    .max(400, "Logo URL must not exceed 400 characters")
    .optional(),
  description: z
    .string()
    .max(255, "Description must be less than 255 characters")
    .optional()
    .nullable(),
  status: z.enum(brandStatusEnum),
});

// Update brand status schema
export const updateBrandStatusSchema = z.object({
  status: z.enum(brandStatusEnum),
});

// Feature-specific types
export type BrandsResponse = z.infer<typeof brandsResponseSchema>;
export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
export type UpdateBrandStatusInput = z.infer<typeof updateBrandStatusSchema>;
