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

export async function bulkUpdateSalesStatus(ids: number[], status: "ACTIVE" | "INACTIVE") {
    const updatePromises = ids.map(async (id) => {
        try {
            const sale = await getSaleById(id);
            if (!sale) return;

            // Map SaleResponse to SaleUpdateRequest expected by backend
            const payload = {
                id: sale.id, // DTO needs ID
                name: sale.name,
                description: sale.description,
                discountPercentage: sale.discountPercentage,
                startDate: sale.startDate, // Already ISO string from response
                endDate: sale.endDate,     // Already ISO string from response
                status: status,
            };

            // Cast to any because updateSale expects SaleRequest (Form Schema) but we are sending Backend DTO structure
            // In a strict setup, we should have separate types for Form vs API.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await updateSale({ id, data: payload as any });
        } catch (error) {
            console.error(`Failed to update status for sale ${id}`, error);
            // Continue with others
        }
    });

    await Promise.all(updatePromises);
}
