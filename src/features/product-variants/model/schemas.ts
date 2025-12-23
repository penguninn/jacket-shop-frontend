import { z } from "zod";
import {
    statusSchema,
    pageResponseSchema,
    type BaseFilterParams,
} from "@/shared/api/schemas";
import { productSchema } from "@/features/products/model/schemas";



export const PRODUCT_VARIANT_CONSTANTS = {
    SKU: {
        MAX_LENGTH: 255,
    },
    SORT_FIELDS: ["id", "sku", "price", "costPrice", "quantity", "createdAt", "updatedAt"] as const,
} as const;


// Redefine nested schemas to match richer API response
const colorSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().optional(), // From API
    hexCode: z.string().optional(), // From API
    status: statusSchema.optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

const sizeSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().optional(),
    status: statusSchema.optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

const materialSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().optional(),
    status: statusSchema.optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export const productVariantSchema = z.object({
    id: z.number(),
    sku: z.string().nullable().optional(),
    productId: z.number().optional(), // Added from API
    product: productSchema.optional(), // Added for relation

    size: sizeSchema,
    color: colorSchema,
    material: materialSchema,
    price: z.number(),
    costPrice: z.number(),

    quantity: z.number(),
    reservedQuantity: z.number().nullish().transform((v) => v ?? 0),
    availableQuantity: z.number().nullish().transform((v) => v ?? 0),

    soldCount: z.number().nullish().transform((v) => v ?? 0),
    returnCount: z.number().nullish().transform((v) => v ?? 0),

    // New API Fields
    salePrice: z.number().nullable().optional(),
    discountPercentage: z.number().nullable().optional(),

    status: statusSchema,
    image: z.string().nullable().optional(),

    weight: z.number().nullable().optional(),
    length: z.number().nullable().optional(),
    width: z.number().nullable().optional(),
    height: z.number().nullable().optional(),

    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
});


export const productVariantsResponseSchema = pageResponseSchema(productVariantSchema);


export const createProductVariantSchema = z.object({
    productId: z.number().min(1, "Product is required"),
    sizeId: z.number().min(1, "Size is required"),
    colorId: z.number().min(1, "Color is required"),
    materialId: z.number().min(1, "Material is required"),
    price: z.number().min(0, "Price must be non-negative"),
    costPrice: z.number().min(0, "Cost Price must be non-negative"),
    quantity: z.number().min(0).default(0),
    status: statusSchema,
    weight: z.number().min(0).optional(),
    length: z.number().min(0).optional(),
    width: z.number().min(0).optional(),
    height: z.number().min(0).optional(),
    image: z.string().optional(),
});

export const updateProductVariantSchema = z.object({
    price: z.number().min(0),
    costPrice: z.number().min(0),
    quantity: z.number().min(0),
    status: statusSchema,
    weight: z.number().min(0).optional(),
    length: z.number().min(0).optional(),
    width: z.number().min(0).optional(),
    height: z.number().min(0).optional(),
    image: z.string().optional(),
});

export const updateProductVariantStatusSchema = z.object({
    status: statusSchema,
});

export const bulkUpdateStatusProductVariantSchema = z.object({
    ids: z.array(z.number()).min(1, "Select at least one variant"),
    status: statusSchema,
});

export const bulkDeleteProductVariantSchema = z.object({
    ids: z.array(z.number()).min(1, "Select at least one variant"),
});

export const stockAdjustmentSchema = z.object({
    quantityChange: z.number(),
});


export interface ProductVariantFilterParams extends BaseFilterParams {
    colorIds?: number[];
    sizeIds?: number[];
    materialIds?: number[];
    fromPrice?: number;
    toPrice?: number;
}

export const productVariantFilterParamsSchema = z.object({
    page: z.number().min(0).default(0),
    size: z.number().min(1).max(100).default(10),
    sortBy: z.enum(PRODUCT_VARIANT_CONSTANTS.SORT_FIELDS).default("createdAt"),
    sortDir: z.enum(["ASC", "DESC"]).default("DESC"),
    search: z.string().optional(),
    status: z.array(statusSchema).optional(),
    colorIds: z.array(z.number()).optional(),
    sizeIds: z.array(z.number()).optional(),
    materialIds: z.array(z.number()).optional(),
    fromPrice: z.number().optional(),
    toPrice: z.number().optional(),
});


export type ProductVariant = z.infer<typeof productVariantSchema>;
export type ProductVariantsResponse = z.infer<typeof productVariantsResponseSchema>;

export type CreateProductVariantInput = z.infer<typeof createProductVariantSchema>;
export type UpdateProductVariantInput = z.infer<typeof updateProductVariantSchema>;
export type UpdateProductVariantStatusInput = z.infer<typeof updateProductVariantStatusSchema>;
export type BulkUpdateStatusProductVariantInput = z.infer<typeof bulkUpdateStatusProductVariantSchema>;
export type BulkDeleteProductVariantInput = z.infer<typeof bulkDeleteProductVariantSchema>;
export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;
