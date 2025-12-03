import { httpPrivateTyped } from "@/shared/api/http-typed";
import { shippingMethodSchema } from "@/features/shipping-methods/model";
import {
    shippingMethodsResponseSchema,
    type CreateShippingMethodInput,
    type UpdateShippingMethodInput,
    type UpdateShippingMethodStatusInput,
} from "../model/schemas";
import z from "zod";

type SortDirection = "asc" | "desc";
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_DIR: SortDirection = "desc";

export interface GetShippingMethodsParams {
    page: number;
    size: number;
    sortBy?: string;
    sortDir?: SortDirection;
    search?: string;
    status?: string[];
}

export async function getShippingMethods(params: GetShippingMethodsParams) {
    const queryParams = new URLSearchParams({
        page: params.page.toString(),
        size: params.size.toString(),
    });

    const sortBy = params.sortBy ?? DEFAULT_SORT_BY;
    const sortDir = params.sortDir ?? DEFAULT_SORT_DIR;

    queryParams.append("sortBy", sortBy);
    queryParams.append("sortDir", sortDir.toUpperCase() as "ASC" | "DESC");

    if (params.search) {
        queryParams.append("search", params.search);
    }
    if (params.status?.length) {
        params.status.forEach((s) => queryParams.append("status", s));
    }

    const res = await httpPrivateTyped.get(
        `/shipping-methods?${queryParams.toString()}`,
        shippingMethodsResponseSchema,
    );
    return res;
}

export async function getShippingMethodById(id: number) {
    const res = await httpPrivateTyped.get(`/shipping-methods/${id}`, shippingMethodSchema);
    return res;
}

export async function createShippingMethod(payload: CreateShippingMethodInput) {
    const res = await httpPrivateTyped.post("/shipping-methods", payload, shippingMethodSchema);
    return res;
}

export async function updateShippingMethod(id: number, payload: UpdateShippingMethodInput) {
    const res = await httpPrivateTyped.put(`/shipping-methods/${id}`, payload, shippingMethodSchema);
    return res;
}

export async function deleteShippingMethod(id: number) {
    await httpPrivateTyped.del(`/shipping-methods/${id}`, z.null());
}

export async function updateStatus(id: number, payload: UpdateShippingMethodStatusInput) {
    await httpPrivateTyped.put(`/shipping-methods/${id}/status`, payload, shippingMethodSchema);
}

export async function bulkUpdateStatus(ids: number[], status: string) {
    await httpPrivateTyped.post("/shipping-methods/bulk/status", { ids, status }, z.null());
}

export async function bulkDelete(ids: number[]) {
    await httpPrivateTyped.post("/shipping-methods/bulk/delete", { ids }, z.null());
}
