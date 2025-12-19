import { httpPrivateTyped } from "@/shared/api/http-typed";
import { z } from "zod";
import {
    saleResponseSchema,
    type SaleRequest,
    type SaleFilterParams,
} from "../model/schemas";
import { pageResponseSchema } from "@/shared/api/schemas";


const ENDPOINTS = Object.freeze({
    SALES: '/sales',
    SALE_BY_ID: (id: number) => `/sales/${id}`,
    BULK_DELETE: '/sales/bulk/delete',
} as const);


export async function getAllSales(params?: SaleFilterParams) {
    return await httpPrivateTyped.get(
        ENDPOINTS.SALES,
        pageResponseSchema(saleResponseSchema),
        { params }
    );
}

export async function getSaleById(id: number) {
    return await httpPrivateTyped.get(
        ENDPOINTS.SALE_BY_ID(id),
        saleResponseSchema
    );
}

export async function createSale(payload: SaleRequest) {
    return await httpPrivateTyped.post(
        ENDPOINTS.SALES,
        payload,
        saleResponseSchema
    );
}

export async function updateSale({ id, data }: { id: number; data: SaleRequest }) {
    return await httpPrivateTyped.put(
        ENDPOINTS.SALE_BY_ID(id),
        data,
        saleResponseSchema
    );
}

export async function deleteSale(id: number) {
    return await httpPrivateTyped.del(
        ENDPOINTS.SALE_BY_ID(id),
        z.null()
    );
}

export async function bulkDeleteSales(ids: number[]) {
    return await httpPrivateTyped.post(
        ENDPOINTS.BULK_DELETE,
        { ids },
        z.null()
    );
}
