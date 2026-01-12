import { z } from "zod";
import {
    statusSchema,
    pageResponseSchema,
    type BaseFilterParams,
} from "@/shared/api/schemas";


export const COUPON_CONSTANTS = Object.freeze({
    CODE: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 50,
        REGEX: /^[A-Z0-9_-]+$/,
    },
    DESCRIPTION: {
        MAX_LENGTH: 255
    },
    SORT_FIELDS: ["id", "code", "validFrom", "validTo", "createdAt", "updatedAt"] as const,
} as const);

export const couponTypeEnum = ["PERCENT", "AMOUNT"] as const;


export const couponSchema = z.object({
    id: z.number(),
    code: z.string(),
    description: z.string().nullable().optional(),
    type: z.enum(couponTypeEnum),
    value: z.number(),
    minOrderValue: z.number().nullable(),
    maxDiscount: z.number().nullable(),
    usageLimit: z.number().nullable(),
    usedCount: z.number(),
    validFrom: z.string(),
    validTo: z.string(),
    status: statusSchema,
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
});


export const couponsResponseSchema = pageResponseSchema(couponSchema);


export const createCouponSchema = z.object({
    code: z
        .string()
        .min(
            COUPON_CONSTANTS.CODE.MIN_LENGTH,
            `Code must be at least ${COUPON_CONSTANTS.CODE.MIN_LENGTH} characters`
        )
        .max(
            COUPON_CONSTANTS.CODE.MAX_LENGTH,
            `Code cannot exceed ${COUPON_CONSTANTS.CODE.MAX_LENGTH} characters`
        )
        .regex(
            COUPON_CONSTANTS.CODE.REGEX,
            "Code can only contain uppercase letters, numbers, - and _"
        ),
    description: z.string().max(255).optional().or(z.literal("")),
    type: z.enum(couponTypeEnum, { message: "Coupon type is required" }),
    value: z.number().min(0, "Value cannot be negative"),
    minOrderValue: z.number().min(0).optional().or(z.literal(0)),
    maxDiscount: z.number().min(0).optional().or(z.literal(0)),
    usageLimit: z.number().int().min(0).optional().or(z.literal(0)),
    usedCount: z.number().int().min(0).optional().or(z.literal(0)), // Added based on DTO
    validFrom: z.string().min(1, "Valid from date is required"),
    validTo: z.string().min(1, "Valid to date is required"),
    status: statusSchema,
});

export const updateCouponSchema = z.object({
    description: z.string().max(255).optional().or(z.literal("")),
    type: z.enum(couponTypeEnum, { message: "Coupon type is required" }),
    value: z.number().min(0, "Value cannot be negative"),
    minOrderValue: z.number().min(0).optional().or(z.literal(0)),
    maxDiscount: z.number().min(0).optional().or(z.literal(0)),
    usageLimit: z.number().int().min(0).optional().or(z.literal(0)),
    usedCount: z.number().int().min(0).optional().or(z.literal(0)), // Added based on DTO
    validFrom: z.string().min(1, "Valid from date is required"),
    validTo: z.string().min(1, "Valid to date is required"),
    status: statusSchema,
});

export const updateCouponStatusSchema = z.object({
    status: statusSchema,
});

export const bulkUpdateStatusCouponSchema = z.object({
    ids: z.array(z.number()).min(1, "Select at least one coupon"),
    status: statusSchema,
});

export const bulkDeleteCouponSchema = z.object({
    ids: z.array(z.number()).min(1, "Select at least one coupon"),
});


export interface CouponFilterParams extends BaseFilterParams {
    type?: string;
}

export const couponFilterParamsSchema = z.object({
    page: z.number().min(0).default(0),
    size: z.number().min(1).max(100).default(10),
    sortBy: z.enum(COUPON_CONSTANTS.SORT_FIELDS).default("createdAt"),
    sortDir: z.enum(["ASC", "DESC"]).default("DESC"),
    search: z.string().optional(),
    status: z.array(statusSchema).optional(),
    type: z.enum(couponTypeEnum).optional(),
});


export type Coupon = z.infer<typeof couponSchema>;
export type CouponStatus = z.infer<typeof statusSchema>;
export type CouponType = typeof couponTypeEnum[number];
export type CouponsResponse = z.infer<typeof couponsResponseSchema>;

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type UpdateCouponStatusInput = z.infer<typeof updateCouponStatusSchema>;
export type BulkUpdateStatusCouponInput = z.infer<typeof bulkUpdateStatusCouponSchema>;
export type BulkDeleteCouponInput = z.infer<typeof bulkDeleteCouponSchema>;

export const validateCouponInputSchema = z.object({
    code: z.string().min(1, "Coupon code is required"),
    orderAmount: z.number().positive("Order amount must be positive"),
});

export type ValidateCouponInput = z.infer<typeof validateCouponInputSchema>;
