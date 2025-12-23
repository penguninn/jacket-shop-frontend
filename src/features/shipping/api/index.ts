import { httpPrivateTyped } from "@/shared/api/http-typed";
import { z } from "zod";
import {
    goshipRateDataSchema,
    type GoshipRateRequest,
    type GoshipRateData
} from "../model/schemas";

export async function getShippingRates(data: GoshipRateRequest): Promise<GoshipRateData[]> {
    // API returns ApiResponse<List<GoshipRateData>>, httpPrivateTyped handles unpacking usually.
    // If httpPrivateTyped expects schema for the *data* part:
    return httpPrivateTyped.post<GoshipRateData[]>("/shipping/rates", data, z.array(goshipRateDataSchema));
}
