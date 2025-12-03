import { httpPrivateTyped } from "@/shared/api/http-typed";
import { materialSchema } from "@/features/materials/model";
import {
    materialsResponseSchema,
    type CreateMaterialInput,
    type UpdateMaterialInput,
    type UpdateMaterialStatusInput,
} from "../model/schemas";
import z from "zod";

type SortDirection = "asc" | "desc";
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_DIR: SortDirection = "desc";

export interface GetMaterialsParams {
    page: number;
    size: number;
    sortBy?: string;
    sortDir?: SortDirection;
    search?: string;
    status?: string[];
}

export async function getMaterials(params: GetMaterialsParams) {
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
        `/materials?${queryParams.toString()}`,
        materialsResponseSchema,
    );
    return res;
}

export async function getMaterialById(id: number) {
    const res = await httpPrivateTyped.get(`/materials/${id}`, materialSchema);
    return res;
}

export async function createMaterial(payload: CreateMaterialInput) {
    const res = await httpPrivateTyped.post("/materials", payload, materialSchema);
    return res;
}

export async function updateMaterial(id: number, payload: UpdateMaterialInput) {
    const res = await httpPrivateTyped.put(`/materials/${id}`, payload, materialSchema);
    return res;
}

export async function deleteMaterial(id: number) {
    await httpPrivateTyped.del(`/materials/${id}`, z.null());
}

export async function updateStatus(id: number, payload: UpdateMaterialStatusInput) {
    await httpPrivateTyped.put(`/materials/${id}/status`, payload, materialSchema);
}

export async function bulkUpdateStatus(ids: number[], status: string) {
    await httpPrivateTyped.post("/materials/bulk/status", { ids, status }, z.null());
}

export async function bulkDelete(ids: number[]) {
    await httpPrivateTyped.post("/materials/bulk/delete", { ids }, z.null());
}
