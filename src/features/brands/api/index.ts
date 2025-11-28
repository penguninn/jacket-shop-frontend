import { httpPrivateTyped } from "@/shared/api/http-typed";
import { brandSchema, brandsResponseSchema, type CreateBrandInput, type UpdateBrandInput, type UpdateBrandStatusInput } from "../model/schemas";
import z from "zod";

type SortDirection = "asc" | "desc";
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_DIR: SortDirection = "desc";

export interface GetBrandsParams {
    page: number;
    size: number;
    sortBy?: string;
    sortDir?: SortDirection;
    search?: string;
    status?: string[];
}

// Get all brands with pagination, filtering, and sorting
export async function getBrands(params: GetBrandsParams) {
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
        `/brands?${queryParams.toString()}`,
        brandsResponseSchema,
    );
    return res;
}

// Get brand by ID
export async function getBrandById(id: number) {
    const res = await httpPrivateTyped.get(`/brands/${id}`, brandSchema);
    return res;
}

// Create new brand
export async function createBrand(data: CreateBrandInput) {
    const res = await httpPrivateTyped.post("/brands", data, brandSchema);
    return res;
}

// Update brand
export async function updateBrand(id: number, data: UpdateBrandInput) {
    const res = await httpPrivateTyped.put(`/brands/${id}`, data, brandSchema);
    return res;
}

// Delete brand
export async function deleteBrand(id: number) {
    await httpPrivateTyped.del(`/brands/${id}`, z.null());
}

// Update brand status
export async function updateBrandStatus(id: number, data: UpdateBrandStatusInput) {
    const res = await httpPrivateTyped.put(`/brands/${id}/status`, data, brandSchema);
    return res;
}

// Bulk update brand status
export async function bulkUpdateBrandStatus(ids: number[], status: string) {
    await httpPrivateTyped.post(
        `/brands/bulk/status`,
        { ids, status },
        z.null(),
    );
}

// Bulk delete brands
export async function bulkDeleteBrands(ids: number[]) {
    await httpPrivateTyped.post(`/brands/bulk/delete`, { ids }, z.void());
}
