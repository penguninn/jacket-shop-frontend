import { z } from "zod";
import { productVariantSchema } from "@/features/product-variants/model/schemas";

// --- Request Schemas ---

export const cartItemRequestSchema = z.object({
    productVariantId: z.number().min(1, "Product Variant ID is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
});

// --- Response Schemas ---

// Inferred from controller, verify if actual response differs
export const cartItemResponseSchema = z.object({
    id: z.number(), // CartItem ID? Or just productVariantId? 
    // Usually CartItem has its own ID, but sometimes it's mapped differently. 
    // Based on `updateCartItem(@PathVariable Long itemId)`, it implies a CartItem entity ID.
    // However, traditionally simple carts might just list variants.
    // The Controller endpoints uses "items/{itemId}", confirming CartItem entity exists and has ID.

    productVariant: productVariantSchema.extend({
        product: z.object({
            id: z.number(),
            name: z.string(),
            thumbnail: z.string().nullable().optional(),
        }).optional(),
    }),
    quantity: z.number(),

    subTotal: z.number().optional(),
});

export const cartResponseSchema = z.object({
    items: z.array(cartItemResponseSchema),
});
