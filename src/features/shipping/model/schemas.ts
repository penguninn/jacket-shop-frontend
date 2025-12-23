import { z } from "zod";

export const addressDtoSchema = z.object({
    district: z.string(),
    city: z.string(),
});

export const parcelSchema = z.object({
    cod: z.number().optional(), // Long in Java
    amount: z.number().optional(), // Long in Java
    width: z.number().optional(),
    height: z.number().optional(),
    length: z.number().optional(),
    weight: z.number().optional(),
});

export const shipmentSchema = z.object({
    address_from: addressDtoSchema,
    address_to: addressDtoSchema,
    parcel: parcelSchema,
});

export const goshipRateRequestSchema = z.object({
    shipment: shipmentSchema,
});

export const goshipRateDataSchema = z.object({
    id: z.string(),
    carrier_name: z.string(),
    carrier_logo: z.string().optional(),
    service: z.string(),
    carrier_short_name: z.string().optional(),
    total_fee: z.number(),
    total_amount: z.number().optional(), // total fee + cod?
    expected: z.string().optional(), // e.g. "2 - 3 days"
});

export type GoshipRateRequest = z.infer<typeof goshipRateRequestSchema>;
export type GoshipRateData = z.infer<typeof goshipRateDataSchema>;
