import { httpPrivateTyped } from "@/shared/api/http-typed";
import { productsResponseSchema } from "../model/schemas";

type SortDirection = "asc" | "desc";
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_DIR: SortDirection = "desc";

export interface GetProductsParams {
    page: number;
    size: number;
    sortBy?: string;
    sortDir?: SortDirection;
    search?: string;
    status?: string[];
    brandIds?: number[];
    categoryIds?: number[];
}

export async function getProducts(params: GetProductsParams) {
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
    if (params.brandIds?.length) {
        params.brandIds.forEach((id) =>
            queryParams.append("brandIds", id.toString())
        );
    }
    if (params.categoryIds?.length) {
        params.categoryIds.forEach((id) =>
            queryParams.append("categoryIds", id.toString())
        );
    }

    const res = await httpPrivateTyped.get(
        `/products?${queryParams.toString()}`,
        productsResponseSchema
    );
    return res;
}
