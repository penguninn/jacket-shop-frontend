import { z } from "zod";
import {
    statusSchema,
    pageResponseSchema,
    type BaseFilterParams,
} from "@/shared/api/schemas";


export const SHIPPING_METHOD_CONSTANTS = Object.freeze({
    NAME: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 100,
    },
    DESCRIPTION: {
        MAX_LENGTH: 255,
    },
    FEE: {
        MIN: 0,
    },
    ESTIMATED_DAYS: {
        MIN: 1,
        MAX: 60,
    },
    SORT_FIELDS: ["id", "name", "fee", "createdAt", "updatedAt"] as const,
} as const);


export const shippingMethodSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable().optional(),
    fee: z.number(),
    estimatedDays: z.number(),
    status: statusSchema,
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
});


export const shippingMethodsResponseSchema = pageResponseSchema(shippingMethodSchema);


export const createShippingMethodSchema = z.object({
    name: z
        .string()
        .min(
            SHIPPING_METHOD_CONSTANTS.NAME.MIN_LENGTH,
            `Name is required`
        )
        .max(
            SHIPPING_METHOD_CONSTANTS.NAME.MAX_LENGTH,
            `Name too long`
        ),
    description: z
        .string()
        .max(
            SHIPPING_METHOD_CONSTANTS.DESCRIPTION.MAX_LENGTH,
            `Description too long`
        )
        .optional(),
    fee: z
        .number()
        .min(SHIPPING_METHOD_CONSTANTS.FEE.MIN, "Fee must be positive"),
    estimatedDays: z
        .number()
        .min(
            SHIPPING_METHOD_CONSTANTS.ESTIMATED_DAYS.MIN,
            `Must be at least ${SHIPPING_METHOD_CONSTANTS.ESTIMATED_DAYS.MIN} day`
        )
        .max(
            SHIPPING_METHOD_CONSTANTS.ESTIMATED_DAYS.MAX,
            `Must be at most ${SHIPPING_METHOD_CONSTANTS.ESTIMATED_DAYS.MAX} days`
        ),
    status: statusSchema,
});

export const updateShippingMethodSchema = z.object({
    name: z
        .string()
        .min(
            SHIPPING_METHOD_CONSTANTS.NAME.MIN_LENGTH,
            `Name is required`
        )
        .max(
            SHIPPING_METHOD_CONSTANTS.NAME.MAX_LENGTH,
            `Name too long`
        ),
    description: z
        .string()
        .max(
            SHIPPING_METHOD_CONSTANTS.DESCRIPTION.MAX_LENGTH,
            `Description too long`
        )
        .optional(),
    fee: z
        .number()
        .min(SHIPPING_METHOD_CONSTANTS.FEE.MIN, "Fee must be positive"),
    estimatedDays: z
        .number()
        .min(
            SHIPPING_METHOD_CONSTANTS.ESTIMATED_DAYS.MIN,
            `Must be at least ${SHIPPING_METHOD_CONSTANTS.ESTIMATED_DAYS.MIN} day`
        )
        .max(
            SHIPPING_METHOD_CONSTANTS.ESTIMATED_DAYS.MAX,
            `Must be at most ${SHIPPING_METHOD_CONSTANTS.ESTIMATED_DAYS.MAX} days`
        ),
    status: statusSchema,
});

export const updateShippingMethodStatusSchema = z.object({
    status: statusSchema,
});

export const bulkUpdateStatusShippingMethodSchema = z.object({
    ids: z.array(z.number()).min(1, "Select at least one shipping method"),
    status: statusSchema,
});

export const bulkDeleteShippingMethodSchema = z.object({
    ids: z.array(z.number()).min(1, "Select at least one shipping method"),
});


export type ShippingMethodFilterParams = BaseFilterParams;

export const shippingMethodFilterParamsSchema = z.object({
    page: z.number().min(0).default(0),
    size: z.number().min(1).max(100).default(10),
    sortBy: z.enum(SHIPPING_METHOD_CONSTANTS.SORT_FIELDS).default("createdAt"),
    sortDir: z.enum(["ASC", "DESC"]).default("DESC"),
    search: z.string().optional(),
    status: z.array(statusSchema).optional(),
});


export type ShippingMethod = z.infer<typeof shippingMethodSchema>;
export type ShippingMethodStatus = z.infer<typeof statusSchema>;
export type ShippingMethodsResponse = z.infer<typeof shippingMethodsResponseSchema>;

export type CreateShippingMethodInput = z.infer<typeof createShippingMethodSchema>;
export type UpdateShippingMethodInput = z.infer<typeof updateShippingMethodSchema>;
export type UpdateShippingMethodStatusInput = z.infer<
    typeof updateShippingMethodStatusSchema
>;
export type BulkUpdateStatusShippingMethodInput = z.infer<
    typeof bulkUpdateStatusShippingMethodSchema
>;
export type BulkDeleteShippingMethodInput = z.infer<
    typeof bulkDeleteShippingMethodSchema
>;
