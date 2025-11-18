import z from "zod";

export const productVariantStatusEnum = ["ACTIVE", "INACTIVE"] as const;

export const productVariantSchema = z.object({
  id: z.number(),
  product: z.object({ id: z.number(), name: z.string() }),
  sku: z.string(),
  size: z.object({ id: z.number(), name: z.string() }),
  color: z.object({ id: z.number(), name: z.string() }),
  price: z.string(), // BigDecimal as string
  costPrice: z.string(),
  salePrice: z.string(),
  quantity: z.number(),
  status: z.enum(productVariantStatusEnum),
  createdAt: z.string(),
  updatedAt: z.string(),
});

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
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const updateProductVariantSchema = z.object({
  sku: z.string(),
  size: z.number(),
  color: z.number(),
  price: z.string(),
  costPrice: z.string(),
  salePrice: z.string(),
  quantity: z.number(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type ProductVariant = z.infer<typeof productVariantSchema>;
export type ProductVariantsResponse = z.infer<
  typeof productVariantsResponseSchema
>;
export type CreateProductVariantInput = z.infer<
  typeof createProductVariantSchema
>;
export type UpdateProductVariantInput = z.infer<
  typeof updateProductVariantSchema
>;
export type ProductVariantStatus = z.infer<
  typeof productVariantSchema
>["status"];
