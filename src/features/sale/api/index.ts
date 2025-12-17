import { httpPrivateTyped } from "@/shared/api/http-typed";
import { z } from "zod";
import { saleResponseSchema, type CreateSaleInput } from "../model/schemas";

// ============================================
// API ENDPOINTS CONSTANTS
// ============================================

const ENDPOINTS = Object.freeze({
    SALES: '/sales',
    SALE_BY_ID: (id: number) => `/sales/${id}`,
} as const);

// ============================================
// API FUNCTIONS
// ============================================

export async function getAllSales() {
    return await httpPrivateTyped.get(
        ENDPOINTS.SALES,
        z.array(saleResponseSchema)
    );
}

export async function applySale(payload: CreateSaleInput) {
    return await httpPrivateTyped.post(
        ENDPOINTS.SALES,
        payload,
        saleResponseSchema // Backend returns SaleResponse
    );
}

export async function removeSale(variantId: number) {
    return await httpPrivateTyped.del(
        ENDPOINTS.SALE_BY_ID(variantId),
        z.null()
    );
}
// Note: httpPrivateTyped usually expects the schema of the 'data' field of ApiResponse.
// In removeSale: .data(response) is NOT called? actually `saleService.removeSale(variantId)` returns void.
// Controller: `return ApiResponse.builder()...build();` (data is missing/null).
// So schema should be z.null().
