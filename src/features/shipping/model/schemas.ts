import { z } from "zod";
import {
    pageResponseSchema,
} from "@/shared/api/schemas";

export const addressDtoSchema = z.object({
    district: z.string(),
    city: z.string(),
});

export const parcelSchema = z.object({
    cod: z.number().optional(),
    amount: z.number().optional(),
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
    total_amount: z.number().optional(),
    expected: z.string().optional(),
});

export const goshipRateResponseSchema = pageResponseSchema(goshipRateDataSchema);

export type GoshipRateRequest = z.infer<typeof goshipRateRequestSchema>;
export type GoshipRateData = z.infer<typeof goshipRateDataSchema>;
export type GoshipRateResponse = z.infer<typeof goshipRateResponseSchema>;

