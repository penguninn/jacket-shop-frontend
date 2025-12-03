import z from "zod";

export const paymentMethodStatusEnum = ["ACTIVE", "INACTIVE"] as const;

export const paymentMethodSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable().optional(),
    configJson: z.string().nullable().optional(),
    status: z.enum(paymentMethodStatusEnum),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
});

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type PaymentMethodStatus = typeof paymentMethodStatusEnum[number];

export const paymentMethodsResponseSchema = z.object({
    contents: z.array(paymentMethodSchema),
    page: z.number(),
    size: z.number(),
    totalPages: z.number(),
    totalElements: z.number(),
});

export const createPaymentMethodSchema = z.object({
    name: z.string().min(1, "Name is required").max(80, "Name must be less than 80 characters"),
    description: z.string().max(255, "Description must be less than 255 characters").optional().or(z.literal("")),
    configJson: z.string().optional().or(z.literal("")),
    status: z.enum(paymentMethodStatusEnum),
});

export const updatePaymentMethodSchema = z.object({
    name: z.string().min(1, "Name is required").max(80, "Name must be less than 80 characters"),
    description: z.string().max(255, "Description must be less than 255 characters").optional().or(z.literal("")),
    configJson: z.string().optional().or(z.literal("")),
    status: z.enum(paymentMethodStatusEnum),
});

export const updatePaymentMethodStatusSchema = z.object({
    status: z.enum(paymentMethodStatusEnum),
});

// Feature-specific types
export type PaymentMethodsResponse = z.infer<typeof paymentMethodsResponseSchema>;
export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethodSchema>;
export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethodSchema>;
export type UpdatePaymentMethodStatusInput = z.infer<typeof updatePaymentMethodStatusSchema>;
