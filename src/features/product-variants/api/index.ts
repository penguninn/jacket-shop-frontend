import { httpPrivateTyped, httpPublicTyped } from "@/shared/api/http-typed";
import {
    productVariantSchema,
    productVariantsResponseSchema,
    importResultSchema,
    type ProductVariantFilterParams,
    type CreateProductVariantInput,
    type UpdateProductVariantInput,
    type UpdateProductVariantStatusInput,
    type BulkUpdateStatusProductVariantInput,
    type BulkDeleteProductVariantInput,
    type StockAdjustmentInput,
} from "../model/schemas";
import { z } from "zod";
import { axiosPrivate } from "@/shared/api/axios.private";


const ENDPOINTS = Object.freeze({
    VARIANTS: '/product-variants',
    VARIANT_BY_ID: (id: number) => `/product-variants/${id}`,
    VARIANT_BY_SKU: (sku: string) => `/product-variants/sku/${sku}`,
    VARIANTS_BY_PRODUCT: (productId: number) => `/product-variants/product/${productId}`,
    VARIANT_STATUS: (id: number) => `/product-variants/${id}/status`,
    ADJUST_STOCK: (id: number) => `/product-variants/${id}/stock`,
    CHECK_STOCK: '/product-variants/check-stock',
    BULK_UPDATE_STATUS: '/product-variants/bulk/status',
    BULK_DELETE: '/product-variants/bulk/delete',
} as const);


function buildQueryParams(params: ProductVariantFilterParams): URLSearchParams {
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

    if (params.colorIds?.length) {
        params.colorIds.forEach((id) => queryParams.append("colorIds", id.toString()));
    }

    if (params.sizeIds?.length) {
        params.sizeIds.forEach((id) => queryParams.append("sizeIds", id.toString()));
    }

    if (params.materialIds?.length) {
        params.materialIds.forEach((id) => queryParams.append("materialIds", id.toString()));
    }

    if (params.fromPrice !== undefined) {
        queryParams.append("fromPrice", params.fromPrice.toString());
    }

    if (params.toPrice !== undefined) {
        queryParams.append("toPrice", params.toPrice.toString());
    }

    return queryParams;
}


// Queries
export async function getProductVariants(params: ProductVariantFilterParams) {
    const queryParams = buildQueryParams(params);
    return await httpPrivateTyped.get(
        `${ENDPOINTS.VARIANTS}?${queryParams.toString()}`,
        productVariantsResponseSchema
    );
}

export async function getProductVariantsByProductId(productId: number) {
    return await httpPrivateTyped.get(
        ENDPOINTS.VARIANTS_BY_PRODUCT(productId),
        z.array(productVariantSchema)
    );
}

export async function getPublicProductVariantsByProduct(productId: number) {
    return await httpPublicTyped.get(
        ENDPOINTS.VARIANTS_BY_PRODUCT(productId),
        z.array(productVariantSchema)
    );
}

export async function getProductVariantById(id: number) {
    return await httpPrivateTyped.get(
        ENDPOINTS.VARIANT_BY_ID(id),
        productVariantSchema
    );
}

// Mutations
export async function createProductVariant(payload: CreateProductVariantInput) {
    return await httpPrivateTyped.post(
        ENDPOINTS.VARIANTS,
        payload,
        productVariantSchema
    );
}

export async function updateProductVariant(id: number, payload: UpdateProductVariantInput) {
    return await httpPrivateTyped.put(
        ENDPOINTS.VARIANT_BY_ID(id),
        payload,
        productVariantSchema
    );
}

export async function updateProductVariantStatus(id: number, payload: UpdateProductVariantStatusInput) {
    return await httpPrivateTyped.put(
        ENDPOINTS.VARIANT_STATUS(id),
        payload,
        productVariantSchema
    );
}

export async function deleteProductVariant(id: number) {
    return await httpPrivateTyped.del(
        ENDPOINTS.VARIANT_BY_ID(id),
        z.null()
    );
}

export async function bulkUpdateProductVariantStatus(payload: BulkUpdateStatusProductVariantInput) {
    return await httpPrivateTyped.post(
        ENDPOINTS.BULK_UPDATE_STATUS,
        payload,
        z.array(productVariantSchema)
    );
}

export async function bulkDeleteProductVariants(payload: BulkDeleteProductVariantInput) {
    return await httpPrivateTyped.post(
        ENDPOINTS.BULK_DELETE,
        payload,
        z.null()
    );
}

export async function getProductVariantBySku(sku: string) {
    return await httpPrivateTyped.get(
        ENDPOINTS.VARIANT_BY_SKU(sku),
        productVariantSchema
    );
}

export async function adjustStock(id: number, payload: StockAdjustmentInput) {
    return await httpPrivateTyped.put(
        ENDPOINTS.ADJUST_STOCK(id),
        payload,
        z.null()
    );
}

export async function checkStock(variantId: number, quantity: number) {
    const params = new URLSearchParams({
        variantId: variantId.toString(),
        quantity: quantity.toString(),
    });
    return await httpPrivateTyped.get(
        `${ENDPOINTS.CHECK_STOCK}?${params.toString()}`,
        z.boolean()
    );
}

// Import product variants from Excel file
export async function importProductVariants(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosPrivate.post("/product-variants/import", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return importResultSchema.parse(response.data.data);
}

