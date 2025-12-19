import { httpPrivateTyped, httpPublicTyped } from "@/shared/api/http-typed";
import {
    productSchema,
    productsResponseSchema,
    brandsResponseSchema,
    stylesResponseSchema,
    type ProductFilterParams,
    type CreateProductInput,
    type UpdateProductInput,
    type UpdateProductStatusInput,
    type BulkUpdateStatusProductInput,
    type BulkDeleteProductInput,
} from "../model/schemas";
import { z } from "zod";


const ENDPOINTS = Object.freeze({
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id: number) => `/products/${id}`,
    PRODUCT_STATUS: (id: number) => `/products/${id}/status`,
    BULK_UPDATE_STATUS: '/products/bulk/status',
    BULK_DELETE: '/products/bulk/delete',
    BRANDS: '/brands',
    STYLES: '/styles',
} as const);


function buildQueryParams(params: ProductFilterParams): URLSearchParams {
    const queryParams = new URLSearchParams({
        page: params.page.toString(),
        size: params.size.toString(),
    });

    if (params.sortBy) {
        queryParams.append("sortBy", params.sortBy);
    }

    if (params.sortDir) {
        queryParams.append("sortDir", params.sortDir);
    }

    if (params.search) {
        queryParams.append("search", params.search);
    }

    if (params.status?.length) {
        params.status.forEach((s) => queryParams.append("status", s));
    }

    if (params.brandIds?.length) {
        params.brandIds.forEach((id) => queryParams.append("brandIds", id.toString()));
    }

    if (params.styleIds?.length) {
        params.styleIds.forEach((id) => queryParams.append("styleIds", id.toString()));
    }

    if (params.colorIds?.length) {
        params.colorIds.forEach((id) => queryParams.append("colorIds", id.toString()));
    }

    if (params.sizeIds?.length) {
        params.sizeIds.forEach((id) => queryParams.append("sizeIds", id.toString()));
    }

    if (params.materialIds?.length) {
        params.materialIds.forEach((id) => queryParams.append("materialIds", id.toString()));
    }

    if (params.minPrice !== undefined) {
        queryParams.append("minPrice", params.minPrice.toString());
    }

    if (params.maxPrice !== undefined) {
        queryParams.append("maxPrice", params.maxPrice.toString());
    }

    return queryParams;
}


// Queries
export async function getProducts(params: ProductFilterParams) {
    const queryParams = buildQueryParams(params);
    return await httpPrivateTyped.get(
        `${ENDPOINTS.PRODUCTS}?${queryParams.toString()}`,
        productsResponseSchema
    );
}

export async function getPublicProducts(params: ProductFilterParams) {
    const queryParams = buildQueryParams(params);
    return await httpPublicTyped.get(
        `${ENDPOINTS.PRODUCTS}?${queryParams.toString()}`,
        productsResponseSchema
    );
}

export async function getProductById(id: number) {
    return await httpPrivateTyped.get(
        ENDPOINTS.PRODUCT_BY_ID(id),
        productSchema
    );
}

export async function getPublicProductById(id: number) {
    return await httpPublicTyped.get(
        ENDPOINTS.PRODUCT_BY_ID(id),
        productSchema
    );
}

// Mutations
export async function createProduct(payload: CreateProductInput) {
    return await httpPrivateTyped.post(
        ENDPOINTS.PRODUCTS,
        payload,
        productSchema
    );
}

export async function updateProduct(id: number, payload: UpdateProductInput) {
    return await httpPrivateTyped.put(
        ENDPOINTS.PRODUCT_BY_ID(id),
        payload,
        productSchema
    );
}

export async function updateProductStatus(id: number, payload: UpdateProductStatusInput) {
    return await httpPrivateTyped.put(
        ENDPOINTS.PRODUCT_STATUS(id),
        payload,
        productSchema
    );
}

export async function deleteProduct(id: number) {
    return await httpPrivateTyped.del(
        ENDPOINTS.PRODUCT_BY_ID(id),
        z.null()
    );
}

export async function bulkUpdateProductStatus(payload: BulkUpdateStatusProductInput) {
    return await httpPrivateTyped.post(
        ENDPOINTS.BULK_UPDATE_STATUS,
        payload,
        z.array(productSchema)
    );
}

export async function bulkDeleteProducts(payload: BulkDeleteProductInput) {
    return await httpPrivateTyped.post(
        ENDPOINTS.BULK_DELETE,
        payload,
        z.null()
    );
}

// -----------------
// Helper Entities API
// -----------------

// Reusing ProductFilterParams structure roughly or defining new simpler ones if needed, 
// using 'any' for now to avoid circular deps or complex type duplication for simple lists.
// Ideally should use specific params if they differ. 
// For now, reusing the manual params pattern or simple object to keep it consistent.

export interface HelperEntityParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
    search?: string;
    status?: string | string[];
}

export async function getBrands(params: HelperEntityParams = {}) {
    // Basic query params construction
    const queryParams = new URLSearchParams({
        page: (params.page ?? 0).toString(),
        size: (params.size ?? 100).toString(),
        sortBy: params.sortBy || "name",
        sortDir: params.sortDir || "asc",
    });

    if (params.search) queryParams.append("search", params.search);
    if (params.status) {
        if (Array.isArray(params.status)) {
            params.status.forEach(s => queryParams.append("status", s));
        } else {
            queryParams.append("status", params.status);
        }
    }

    return await httpPrivateTyped.get(
        `${ENDPOINTS.BRANDS}?${queryParams.toString()}`,
        brandsResponseSchema
    );
}

export async function getStyles(params: HelperEntityParams = {}) {
    const queryParams = new URLSearchParams({
        page: (params.page ?? 0).toString(),
        size: (params.size ?? 100).toString(),
        sortBy: params.sortBy || "name",
        sortDir: params.sortDir || "asc",
    });

    if (params.search) queryParams.append("search", params.search);
    if (params.status) {
        if (Array.isArray(params.status)) {
            params.status.forEach(s => queryParams.append("status", s));
        } else {
            queryParams.append("status", params.status);
        }
    }

    return await httpPrivateTyped.get(
        `${ENDPOINTS.STYLES}?${queryParams.toString()}`,
        stylesResponseSchema
    );
}
