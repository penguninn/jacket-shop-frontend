import z from "zod";

export const productStatusEnum = ["ACTIVE", "INACTIVE", "DRAFT", "ARCHIVED"] as const; // Added common statuses, can be adjusted

// Helper schemas for related entities
export const categoryResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  // Add other fields if known
});

export const brandResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const brandsResponseSchema = z.object({
  contents: z.array(brandResponseSchema),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

export const materialResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const styleResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const stylesResponseSchema = z.object({
  contents: z.array(styleResponseSchema),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: categoryResponseSchema.nullable().optional(),
  brand: brandResponseSchema.nullable().optional(),
  description: z.string().nullable().optional(),
  material: materialResponseSchema.nullable().optional(),
  style: styleResponseSchema.nullable().optional(),
  imagesJson: z.string().nullable().optional(), // Keeping as string as per DTO
  status: z.enum(productStatusEnum),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductStatus = typeof productStatusEnum[number];

export const productsResponseSchema = z.object({
  contents: z.array(productSchema),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.number().optional(),
  brandId: z.number().optional(),
  description: z.string().optional(),
  materialId: z.number().optional(),
  styleId: z.number().optional(),
  imagesJson: z.string().optional(),
  status: z.enum(productStatusEnum),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.number().optional(),
  brandId: z.number().optional(),
  description: z.string().optional(),
  materialId: z.number().optional(),
  styleId: z.number().optional(),
  imagesJson: z.string().optional(),
  status: z.enum(productStatusEnum),
});

export const updateProductStatusSchema = z.object({
  status: z.enum(productStatusEnum),
});

// Feature-specific types
export type ProductsResponse = z.infer<typeof productsResponseSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type UpdateProductStatusInput = z.infer<typeof updateProductStatusSchema>;
