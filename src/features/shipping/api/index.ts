import { httpPrivateTyped } from "@/shared/api/http-typed";
import {
    type GoshipRateRequest,
    type GoshipRateResponse,
    goshipRateResponseSchema
} from "../model/schemas";

export async function getShippingRates(data: GoshipRateRequest): Promise<GoshipRateResponse> {
    return httpPrivateTyped.post<GoshipRateResponse>("/shipping/rates", data, goshipRateResponseSchema);
}
