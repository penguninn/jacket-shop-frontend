import { httpPrivateTyped } from "@/shared/api/http-typed";
import { paymentMethodSchema } from "@/features/payment-methods/model";
import {
    paymentMethodsResponseSchema,
    type CreatePaymentMethodInput,
    type UpdatePaymentMethodInput,
    type UpdatePaymentMethodStatusInput,
} from "../model/schemas";
import z from "zod";

type SortDirection = "asc" | "desc";
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_DIR: SortDirection = "desc";

export interface GetPaymentMethodsParams {
    page: number;
    size: number;
    sortBy?: string;
    sortDir?: SortDirection;
    search?: string;
    status?: string[];
}

export async function getPaymentMethods(params: GetPaymentMethodsParams) {
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
        `/payment-methods?${queryParams.toString()}`,
        paymentMethodsResponseSchema,
    );
    return res;
}

export async function getPaymentMethodById(id: number) {
    const res = await httpPrivateTyped.get(`/payment-methods/${id}`, paymentMethodSchema);
    return res;
}

export async function createPaymentMethod(payload: CreatePaymentMethodInput) {
    const res = await httpPrivateTyped.post("/payment-methods", payload, paymentMethodSchema);
    return res;
}

export async function updatePaymentMethod(id: number, payload: UpdatePaymentMethodInput) {
    const res = await httpPrivateTyped.put(`/payment-methods/${id}`, payload, paymentMethodSchema);
    return res;
}

export async function deletePaymentMethod(id: number) {
    await httpPrivateTyped.del(`/payment-methods/${id}`, z.null());
}

export async function updatePaymentMethodStatus(id: number, payload: UpdatePaymentMethodStatusInput) {
    await httpPrivateTyped.put(`/payment-methods/${id}/status`, payload, paymentMethodSchema);
}

export async function bulkUpdatePaymentMethodStatus(ids: number[], status: string) {
    await httpPrivateTyped.post("/payment-methods/bulk/status", { ids, status }, z.null());
}

export async function bulkDeletePaymentMethods(ids: number[]) {
    await httpPrivateTyped.post("/payment-methods/bulk/delete", { ids }, z.null());
}
