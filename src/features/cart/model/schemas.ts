import { z } from "zod";
import { productVariantSchema } from "@/features/product-variants/model/schemas";

export const cartItemRequestSchema = z.object({
    productVariantId: z.number().min(1, "Product Variant ID is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const cartItemResponseSchema = z.object({
    id: z.number(),
    productVariant: productVariantSchema.extend({
        productName: z.string().optional(),
    }),
    quantity: z.number(),
    selected: z.boolean(),

    price: z.number(),
    originalPrice: z.number(),
    discountPercentage: z.number(),

    subtotal: z.number(),

    createdAt: z.string(),
    updatedAt: z.string(),
});

export const cartValidationResponseSchema = z.object({
    valid: z.boolean(),
    issues: z.array(z.object({
        productVariantId: z.number(),
        productName: z.string(),
        issueType: z.string(),
        message: z.string(),
    })),
});

export const cartResponseSchema = z.object({
    id: z.number(),
    userId: z.number(),
    items: z.array(cartItemResponseSchema),
    totalItems: z.number(),
    totalPrice: z.number(),
    selectedItemsCount: z.number(),
    selectedItemsTotal: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type CartItemResponse = z.infer<typeof cartItemResponseSchema>;
export type CartResponse = z.infer<typeof cartResponseSchema>;
export type CartValidationResponse = z.infer<typeof cartValidationResponseSchema>;
