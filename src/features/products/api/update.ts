import { httpPrivateTyped } from "@/shared/api/http-typed";
import { productSchema } from "@/entities/product";
import type { UpdateProductInput, UpdateProductStatusInput } from "../model/types";
import z from "zod";

export async function updateProduct(id: number, payload: UpdateProductInput) {
    const res = await httpPrivateTyped.put(
        `/products/${id}`,
        payload,
        productSchema
    );
    return res;
}

export async function updateProductStatus(
    id: number,
    payload: UpdateProductStatusInput
) {
    await httpPrivateTyped.put(`/products/${id}/status`, payload, productSchema);
}

export async function bulkUpdateProductStatus(ids: number[], status: string) {
    await httpPrivateTyped.post(
        "/products/bulk/status",
        { ids, status },
        z.null()
    );
}
