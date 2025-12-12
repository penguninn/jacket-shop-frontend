import { z } from "zod";
import {
    statusSchema,
    pageResponseSchema,
    type BaseFilterParams,
} from "@/shared/api/schemas";

// ============================================
// CONSTANTS
// ============================================

export const PAYMENT_METHOD_CONSTANTS = Object.freeze({
    NAME: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 80,
    },
    DESCRIPTION: {
        MAX_LENGTH: 255,
    },
    SORT_FIELDS: ["id", "name", "createdAt", "updatedAt"] as const,
} as const);

// ============================================
// DOMAIN SCHEMAS
// ============================================

export const paymentMethodSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable().optional(),
    configJson: z.string().nullable().optional(),
    status: statusSchema,
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
});

// ============================================
// RESPONSE SCHEMAS
// ============================================

export const paymentMethodsResponseSchema = pageResponseSchema(paymentMethodSchema);

// ============================================
// INPUT SCHEMAS
// ============================================

export const createPaymentMethodSchema = z.object({
    name: z
        .string()
        .min(
            PAYMENT_METHOD_CONSTANTS.NAME.MIN_LENGTH,
            `Name must be at least ${PAYMENT_METHOD_CONSTANTS.NAME.MIN_LENGTH} characters`
        )
        .max(
            PAYMENT_METHOD_CONSTANTS.NAME.MAX_LENGTH,
            `Name must be less than ${PAYMENT_METHOD_CONSTANTS.NAME.MAX_LENGTH} characters`
        ),
    description: z
        .string()
        .max(
            PAYMENT_METHOD_CONSTANTS.DESCRIPTION.MAX_LENGTH,
            `Description must be less than ${PAYMENT_METHOD_CONSTANTS.DESCRIPTION.MAX_LENGTH} characters`
        )
        .optional()
        .or(z.literal("")),
    configJson: z.string().optional().or(z.literal("")),
    status: statusSchema,
});

export const updatePaymentMethodSchema = z.object({
    name: z
        .string()
        .min(
            PAYMENT_METHOD_CONSTANTS.NAME.MIN_LENGTH,
            `Name must be at least ${PAYMENT_METHOD_CONSTANTS.NAME.MIN_LENGTH} characters`
        )
        .max(
            PAYMENT_METHOD_CONSTANTS.NAME.MAX_LENGTH,
            `Name must be less than ${PAYMENT_METHOD_CONSTANTS.NAME.MAX_LENGTH} characters`
        ),
    description: z
        .string()
        .max(
            PAYMENT_METHOD_CONSTANTS.DESCRIPTION.MAX_LENGTH,
            `Description must be less than ${PAYMENT_METHOD_CONSTANTS.DESCRIPTION.MAX_LENGTH} characters`
        )
        .optional()
        .or(z.literal("")),
    configJson: z.string().optional().or(z.literal("")),
    status: statusSchema,
});

export const updatePaymentMethodStatusSchema = z.object({
    status: statusSchema,
});

export const bulkUpdateStatusPaymentMethodSchema = z.object({
    ids: z.array(z.number()).min(1, "Select at least one payment method"),
    status: statusSchema,
});

export const bulkDeletePaymentMethodSchema = z.object({
    ids: z.array(z.number()).min(1, "Select at least one payment method"),
});

// ============================================
// FILTER PARAMS SCHEMA
// ============================================

export interface PaymentMethodFilterParams extends BaseFilterParams { }

export const paymentMethodFilterParamsSchema = z.object({
    page: z.number().min(0).default(0),
    size: z.number().min(1).max(100).default(10),
    sortBy: z.enum(PAYMENT_METHOD_CONSTANTS.SORT_FIELDS).default("createdAt"),
    sortDir: z.enum(["ASC", "DESC"]).default("DESC"),
    search: z.string().optional(),
    status: z.array(statusSchema).optional(),
});

// ============================================
// TYPESCRIPT TYPES
// ============================================

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type PaymentMethodStatus = z.infer<typeof statusSchema>;
export type PaymentMethodsResponse = z.infer<typeof paymentMethodsResponseSchema>;

export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethodSchema>;
export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethodSchema>;
export type UpdatePaymentMethodStatusInput = z.infer<
    typeof updatePaymentMethodStatusSchema
>;
export type BulkUpdateStatusPaymentMethodInput = z.infer<
    typeof bulkUpdateStatusPaymentMethodSchema
>;
export type BulkDeletePaymentMethodInput = z.infer<
    typeof bulkDeletePaymentMethodSchema
>;
