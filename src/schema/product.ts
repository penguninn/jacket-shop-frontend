import z from "zod";

export const productStatusEnum = ["ACTIVE", "INACTIVE"] as const;

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.object({ id: z.number(), name: z.string() }),
  brand: z.object({ id: z.number(), name: z.string() }),
  description: z.string().nullable(),
  material: z.object({ id: z.number(), name: z.string() }).nullable(),
  style: z.object({ id: z.number(), name: z.string() }).nullable(),
  imagesJson: z.string().nullable(),
  status: z.enum(productStatusEnum),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const productsResponseSchema = z.object({
  contents: z.array(productSchema),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

export const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.number(),
  brand: z.number(),
  description: z.string().optional().or(z.literal("")),
  material: z.number().optional(),
  style: z.number().optional(),
  imagesJson: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const updateProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.number(),
  brand: z.number(),
  description: z.string().optional().or(z.literal("")),
  material: z.number().optional(),
  style: z.number().optional(),
  imagesJson: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const updateProductStatusSchema = z.object({
  status: z.string().min(2, "Status is required"),
});

export type Product = z.infer<typeof productSchema>;
export type ProductsResponse = z.infer<typeof productsResponseSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type UpdateProductStatusInput = z.infer<
  typeof updateProductStatusSchema
>;
export type ProductStatus = z.infer<typeof productSchema>["status"];
