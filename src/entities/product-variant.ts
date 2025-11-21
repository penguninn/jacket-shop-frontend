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

export type ProductVariant = z.infer<typeof productVariantSchema>;
export type ProductVariantStatus = typeof productVariantStatusEnum[number];
