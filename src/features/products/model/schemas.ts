import z from "zod";

export const productStatusEnum = ["ACTIVE", "INACTIVE"] as const;
export const commonStatusEnum = ["ACTIVE", "INACTIVE"] as const;

// Helper schemas for related entities
export const categoryResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(commonStatusEnum),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const brandResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  logoUrl: z.string().nullable().optional(),
  status: z.enum(commonStatusEnum),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const materialResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: z.enum(commonStatusEnum),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const styleResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: z.enum(commonStatusEnum),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
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

// Helper entity types
export type Category = z.infer<typeof categoryResponseSchema>;
export type Brand = z.infer<typeof brandResponseSchema>;
export type Material = z.infer<typeof materialResponseSchema>;
export type Style = z.infer<typeof styleResponseSchema>;

// Page Response schemas for helper entities
export const categoriesResponseSchema = z.object({
  contents: z.array(categoryResponseSchema),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

export const brandsResponseSchema = z.object({
  contents: z.array(brandResponseSchema),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

export const materialsResponseSchema = z.object({
  contents: z.array(materialResponseSchema),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

export const stylesResponseSchema = z.object({
  contents: z.array(styleResponseSchema),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>;
export type BrandsResponse = z.infer<typeof brandsResponseSchema>;
export type MaterialsResponse = z.infer<typeof materialsResponseSchema>;
export type StylesResponse = z.infer<typeof stylesResponseSchema>;
