import { httpPrivateTyped, httpPublicTyped } from "@/shared/api/http-typed";
import { styleSchema, stylesResponseSchema, importResultSchema, type CreateStyleInput, type UpdateStyleInput, type UpdateStyleStatusInput } from "../model/schemas";
import z from "zod";
import { axiosPrivate } from "@/shared/api/axios.private";

type SortDirection = "asc" | "desc";
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_DIR: SortDirection = "desc";

export interface GetStylesParams {
    page: number;
    size: number;
    sortBy?: string;
    sortDir?: SortDirection;
    search?: string;
    status?: string[];
}

// Get all styles with pagination, filtering, and sorting
export async function getStyles(params: GetStylesParams) {
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
        `/styles?${queryParams.toString()}`,
        stylesResponseSchema,
    );
    return res;
}

// Get all public styles
export async function getPublicStyles(params: GetStylesParams) {
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

    const res = await httpPublicTyped.get(
        `/styles?${queryParams.toString()}`,
        stylesResponseSchema,
    );
    return res;
}

// Get style by ID
export async function getStyleById(id: number) {
    const res = await httpPrivateTyped.get(`/styles/${id}`, styleSchema);
    return res;
}

// Create new style
export async function createStyle(data: CreateStyleInput) {
    const res = await httpPrivateTyped.post("/styles", data, styleSchema);
    return res;
}

// Update style
export async function updateStyle(id: number, data: UpdateStyleInput) {
    const res = await httpPrivateTyped.put(`/styles/${id}`, data, styleSchema);
    return res;
}

// Delete style
export async function deleteStyle(id: number) {
    await httpPrivateTyped.del(`/styles/${id}`, z.null());
}

// Update style status
export async function updateStyleStatus(id: number, data: UpdateStyleStatusInput) {
    const res = await httpPrivateTyped.put(`/styles/${id}/status`, data, styleSchema);
    return res;
}

// Bulk update style status
export async function bulkUpdateStyleStatus(ids: number[], status: string) {
    await httpPrivateTyped.post(
        `/styles/bulk/status`,
        { ids, status },
        z.array(styleSchema),
    );
}

// Bulk delete styles
export async function bulkDeleteStyles(ids: number[]) {
    await httpPrivateTyped.post(`/styles/bulk/delete`, { ids }, z.void());
}

// Import styles from Excel file
export async function importStyles(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosPrivate.post("/styles/import", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return importResultSchema.parse(response.data.data);
}
