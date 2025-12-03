import z from "zod";

export const shippingMethodStatusEnum = ["ACTIVE", "INACTIVE"] as const;

export const shippingMethodSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable().optional(),
    fee: z.number(),
    estimatedDays: z.number(),
    status: z.enum(shippingMethodStatusEnum),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
});

export type ShippingMethod = z.infer<typeof shippingMethodSchema>;
export type ShippingMethodStatus = typeof shippingMethodStatusEnum[number];

export const shippingMethodsResponseSchema = z.object({
    contents: z.array(shippingMethodSchema),
    page: z.number(),
    size: z.number(),
    totalPages: z.number(),
    totalElements: z.number(),
});

export const createShippingMethodSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    description: z.string().max(255, "Description too long").optional(),
    fee: z.number().min(0, "Fee must be positive"),
    estimatedDays: z.number().min(1, "Must be at least 1 day").max(60, "Must be at most 60 days"),
    status: z.enum(shippingMethodStatusEnum),
});

export const updateShippingMethodSchema = createShippingMethodSchema;

export const updateShippingMethodStatusSchema = z.object({
    status: z.enum(shippingMethodStatusEnum),
});

// Feature-specific types
export type ShippingMethodsResponse = z.infer<typeof shippingMethodsResponseSchema>;
export type CreateShippingMethodInput = z.infer<typeof createShippingMethodSchema>;
export type UpdateShippingMethodInput = z.infer<typeof updateShippingMethodSchema>;
export type UpdateShippingMethodStatusInput = z.infer<typeof updateShippingMethodStatusSchema>;
