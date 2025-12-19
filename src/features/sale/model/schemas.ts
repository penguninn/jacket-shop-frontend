import { z } from "zod";


export const saleVariantDetailSchema = z.object({
    variantId: z.number(),
    productName: z.string().nullable().optional(),
    sku: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    originalPrice: z.number().nullable().optional(),
    salePrice: z.number().nullable().optional(),
});

export const saleResponseSchema = z.object({
    id: z.number(),
    name: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    startDate: z.string().nullable(), // ISO string
    endDate: z.string().nullable(),   // ISO string
    discountPercentage: z.number().nullable(),
    variants: z.array(saleVariantDetailSchema).nullable().optional(),
});


export const saleRequestSchema = z.object({
    productVariantIds: z.array(z.number()).min(1, "At least one variant is required"),
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    description: z.string().max(255, "Description is too long").optional(),
    saleStartDate: z.string().min(1, "Start date is required"),
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

export const saleFilterSchema = z.object({
    search: z.string().optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    minDiscount: z.number().optional(),
    maxDiscount: z.number().optional(),
    page: z.number().default(0),
    size: z.number().default(10),
    sortBy: z.string().default("createdAt"),
    sortDir: z.enum(["ASC", "DESC"]).default("DESC"),
});


export type SaleResponse = z.infer<typeof saleResponseSchema>;
export type SaleVariantDetail = z.infer<typeof saleVariantDetailSchema>;
export type SaleRequest = z.infer<typeof saleRequestSchema>;
export type SaleFilterParams = z.infer<typeof saleFilterSchema>;
