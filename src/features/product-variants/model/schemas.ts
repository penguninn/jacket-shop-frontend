import z from "zod";
import { productVariantSchema, productVariantStatusEnum } from "@/entities/product-variant";

export const productVariantsResponseSchema = z.object({
  contents: z.array(productVariantSchema),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

export const createProductVariantSchema = z.object({
  product: z.number(),
  sku: z.string(),
  size: z.number(),
  color: z.number(),
  price: z.string(),
  costPrice: z.string(),
  salePrice: z.string(),
  quantity: z.number(),
  status: z.enum(productVariantStatusEnum),
});

export const updateProductVariantSchema = z.object({
  sku: z.string(),
  size: z.number(),
  color: z.number(),
  price: z.string(),
  costPrice: z.string(),
  salePrice: z.string(),
  quantity: z.number(),
  status: z.enum(productVariantStatusEnum),
});

// Re-export types from entities
export type { ProductVariant, ProductVariantStatus } from "@/entities/product-variant";

// Feature-specific types
export type ProductVariantsResponse = z.infer<
  typeof productVariantsResponseSchema
>;
export type CreateProductVariantInput = z.infer<
  typeof createProductVariantSchema
>;
export type UpdateProductVariantInput = z.infer<
  typeof updateProductVariantSchema
>;
