import { httpPrivateTyped } from "@/shared/api/http-typed";
import { couponSchema } from "@/features/coupons/model";
import {
    couponsResponseSchema,
    type CreateCouponInput,
    type UpdateCouponInput,
    type UpdateCouponStatusInput,
} from "../model/schemas";
import z from "zod";

type SortDirection = "asc" | "desc";
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_DIR: SortDirection = "desc";

export interface GetCouponsParams {
    page: number;
    size: number;
    sortBy?: string;
    sortDir?: SortDirection;
    search?: string;
    status?: string[];
    type?: string[];
}

export async function getCoupons(params: GetCouponsParams) {
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
    if (params.type?.length) {
        params.type.forEach((t) => queryParams.append("type", t));
    }

    const res = await httpPrivateTyped.get(
        `/coupons?${queryParams.toString()}`,
        couponsResponseSchema,
    );
    return res;
}

export async function getCouponById(id: number) {
    const res = await httpPrivateTyped.get(`/coupons/${id}`, couponSchema);
    return res;
}

export async function createCoupon(payload: CreateCouponInput) {
    const res = await httpPrivateTyped.post("/coupons", payload, couponSchema);
    return res;
}

export async function getCouponByCode(code: string) {
    const res = await httpPrivateTyped.get(`/coupons/code/${code}`, couponSchema);
    return res;
}

export async function updateCoupon(id: number, payload: UpdateCouponInput) {
    const res = await httpPrivateTyped.put(`/coupons/${id}`, payload, couponSchema);
    return res;
}

export async function deleteCoupon(id: number) {
    await httpPrivateTyped.del(`/coupons/${id}`, z.null());
}

export async function updateStatus(id: number, payload: UpdateCouponStatusInput) {
    await httpPrivateTyped.put(`/coupons/${id}/status`, payload, couponSchema);
}

export async function bulkUpdateStatus(ids: number[], status: string) {
    await httpPrivateTyped.post("/coupons/bulk/status", { ids, status }, z.array(couponSchema));
}

export async function bulkDelete(ids: number[]) {
    await httpPrivateTyped.post("/coupons/bulk/delete", { ids }, z.null());
}
