import z from "zod";

export const couponStatusEnum = ["ACTIVE", "INACTIVE"] as const;
export const couponTypeEnum = ["PERCENT", "AMOUNT"] as const;

export const couponSchema = z.object({
    id: z.number(),
    code: z.string(),
    description: z.string().nullable(),
    type: z.enum(couponTypeEnum),
    value: z.number(),
    minOrderValue: z.number().nullable(),
    maxDiscount: z.number().nullable(),
    usageLimit: z.number().nullable(),
    usedCount: z.number(),
    validFrom: z.string(),
    validTo: z.string(),
    status: z.enum(couponStatusEnum),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
});

export type Coupon = z.infer<typeof couponSchema>;
export type CouponStatus = typeof couponStatusEnum[number];
export type CouponType = typeof couponTypeEnum[number];

export const couponsResponseSchema = z.object({
    contents: z.array(couponSchema),
    page: z.number(),
    size: z.number(),
    totalPages: z.number(),
    totalElements: z.number(),
});

export const createCouponSchema = z.object({
    code: z
        .string()
        .min(3, "Code must be at least 3 characters")
        .max(50, "Code cannot exceed 50 characters")
        .regex(
            /^[A-Z0-9_-]+$/,
            "Code can only contain uppercase letters, numbers, - and _",
        ),
    description: z.string().optional().or(z.literal("")),
    type: z.enum(couponTypeEnum, { message: "Coupon type is required" }),
    value: z
        .number()
        .positive("Value must be positive"),
    minOrderValue: z
        .number()
        .positive("Minimum order value must be positive")
        .optional()
        .or(z.literal(0)),
    maxDiscount: z
        .number()
        .positive("Maximum discount must be positive")
        .optional()
        .or(z.literal(0)),
    usageLimit: z
        .number()
        .int("Usage limit must be an integer")
        .positive("Usage limit must be positive")
        .optional()
        .or(z.literal(0)),
    validFrom: z.string().min(1, "Valid from date is required"),
    validTo: z.string().min(1, "Valid to date is required"),
    status: z.enum(couponStatusEnum),
});

export const updateCouponSchema = z.object({
    description: z.string().optional().or(z.literal("")),
    type: z.enum(couponTypeEnum, { message: "Coupon type is required" }),
    value: z
        .number()
        .positive("Value must be positive"),
    minOrderValue: z
        .number()
        .positive("Minimum order value must be positive")
        .optional()
        .or(z.literal(0)),
    maxDiscount: z
        .number()
        .positive("Maximum discount must be positive")
        .optional()
        .or(z.literal(0)),
    usageLimit: z
        .number()
        .int("Usage limit must be an integer")
        .positive("Usage limit must be positive")
        .optional()
        .or(z.literal(0)),
    validFrom: z.string().min(1, "Valid from date is required"),
    validTo: z.string().min(1, "Valid to date is required"),
    status: z.enum(couponStatusEnum),
});

export const updateCouponStatusSchema = z.object({
    status: z.string().min(2, "Status is required"),
});

// Feature-specific types
export type CouponsResponse = z.infer<typeof couponsResponseSchema>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type UpdateCouponStatusInput = z.infer<typeof updateCouponStatusSchema>;
