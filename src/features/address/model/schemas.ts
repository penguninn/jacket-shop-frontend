import { z } from "zod";

// --- Location Schemas ---

export const provinceSchema = z.object({
    id: z.number(),
    name: z.string(),
    goShipId: z.string(),
});

export const districtSchema = z.object({
    id: z.number(),
    provinceId: z.number(),
    name: z.string(),
    goShipId: z.string(),
});

export const wardSchema = z.object({
    id: z.number(),
    districtId: z.number(),
    name: z.string(),
    goShipId: z.string(),
});

export type Province = z.infer<typeof provinceSchema>;
export type District = z.infer<typeof districtSchema>;
export type Ward = z.infer<typeof wardSchema>;

// --- Address Schemas ---

export const addressRequestSchema = z.object({
    addressLine: z.string()
        .min(1, "Address line cannot be empty")
        .max(255, "Address line must be less than 255 characters"),
    wardId: z.number(),
    districtId: z.number(),
    provinceId: z.number(),
    isDefault: z.boolean().optional(),
    recipientName: z.string()
        .max(120, "Recipient name must be less than 120 characters")
        .optional()
        .or(z.literal("")),
    recipientPhone: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .max(20, "Phone number must be at most 20 digits")
        .regex(/^0\d{9,14}$/, "Phone number must start with 0 and contain only digits")
        .optional()
        .or(z.literal("")),
});

export const addressResponseSchema = z.object({
    id: z.number(),
    addressLine: z.string(),
    ward: wardSchema, // Use the defined schema
    district: districtSchema,
    province: provinceSchema,
    isDefault: z.boolean().nullable().optional(),
    recipientName: z.string().nullable().optional(),
    recipientPhone: z.string().nullable().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type AddressRequest = z.infer<typeof addressRequestSchema>;
export type AddressResponse = z.infer<typeof addressResponseSchema>;
