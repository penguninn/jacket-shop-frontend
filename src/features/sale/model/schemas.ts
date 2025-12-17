import { z } from "zod";

// ============================================
// DOMAIN SCHEMAS
// ============================================

export const saleResponseSchema = z.object({
    variantId: z.number(),
    productName: z.string().nullable(),
    sku: z.string().nullable(),
    image: z.string().nullable(),
    originalPrice: z.number().nullable(),
    saleStartDate: z.string().nullable(), // ISO string from backend
    saleEndDate: z.string().nullable(),   // ISO string from backend
    salePrice: z.number().nullable(),
    discountPercentage: z.number().nullable(),
});

// ============================================
// INPUT SCHEMAS
// ============================================

export const createSaleSchema = z.object({
    variantId: z.coerce.number().min(1, "Variant ID is required"),
    saleStartDate: z.string().min(1, "Start date is required"), // Expecting ISO string or date string
    saleEndDate: z.string().min(1, "End date is required"),
    discountPercentage: z.coerce
        .number()
        .min(0, "Discount must be at least 0%")
        .max(100, "Discount cannot exceed 100%"),
}).refine((data) => {
    const start = new Date(data.saleStartDate);
    const end = new Date(data.saleEndDate);
    return end > start;
}, {
    message: "End date must be after start date",
    path: ["saleEndDate"],
});

// ============================================
// TYPESCRIPT TYPES
// ============================================

export type SaleResponse = z.infer<typeof saleResponseSchema>;
export type CreateSaleInput = z.infer<typeof createSaleSchema>;
