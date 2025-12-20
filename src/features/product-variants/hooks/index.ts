import { useQuery } from "@tanstack/react-query";
import { useGlobalMutation } from "@/shared/hooks/use-global-mutation";
import {
    getProductVariants,
    getProductVariantsByProductId,
    getPublicProductVariantsByProduct,
    getProductVariantById,
    createProductVariant,
    updateProductVariant,
    updateProductVariantStatus,
    deleteProductVariant,
    bulkUpdateProductVariantStatus,
    bulkDeleteProductVariants,
    adjustStock,
} from "../api";
import type {
    ProductVariant,
    ProductVariantFilterParams,
    CreateProductVariantInput,
    UpdateProductVariantInput,
    UpdateProductVariantStatusInput,
    BulkUpdateStatusProductVariantInput,
    BulkDeleteProductVariantInput,
    StockAdjustmentInput,
} from "../model/schemas";
import type { BaseMutationOptions } from "@/shared/api/types";


export const productVariantKeys = {
    all: ['product-variants'] as const,
    lists: () => [...productVariantKeys.all, 'list'] as const,
    list: (params: ProductVariantFilterParams) => [...productVariantKeys.lists(), params] as const,
    byProduct: (productId: number) => [...productVariantKeys.all, 'by-product', productId] as const,
    details: () => [...productVariantKeys.all, 'detail'] as const,
    detail: (id: number) => [...productVariantKeys.details(), id] as const,
} as const;


export function useProductVariants(params: ProductVariantFilterParams) {
    return useQuery({
        queryKey: productVariantKeys.list(params),
        queryFn: () => getProductVariants(params),
    });
}

export function useProductVariantsByProduct(productId: number, enabled = true) {
    return useQuery({
        queryKey: productVariantKeys.byProduct(productId),
        queryFn: () => getProductVariantsByProductId(productId),
        enabled: enabled && !!productId,
    });
}

export function usePublicProductVariantsByProduct(productId: number, enabled = true) {
    return useQuery({
        queryKey: [...productVariantKeys.byProduct(productId), 'public'],
        queryFn: () => getPublicProductVariantsByProduct(productId),
        enabled: enabled && !!productId,
    });
}

export function useProductVariantDetail(id: number, enabled = true) {
    return useQuery({
        queryKey: productVariantKeys.detail(id),
        queryFn: () => getProductVariantById(id),
        enabled: enabled && !!id,
    });
}


export function useCreateProductVariant(options?: BaseMutationOptions) {
    return useGlobalMutation<ProductVariant, CreateProductVariantInput>({
        mutationFn: createProductVariant,
        invalidateQueries: [
            [...productVariantKeys.all] as string[],
        ],
        successMessage: "Variant created successfully",
        errorContext: "Create Variant",
        setError: options?.setError,
    });
}

export function useUpdateProductVariant(options?: BaseMutationOptions) {
    return useGlobalMutation<ProductVariant, { id: number; data: UpdateProductVariantInput }>({
        mutationFn: ({ id, data }) => updateProductVariant(id, data),
        invalidateQueries: [
            [...productVariantKeys.all] as string[],
        ],
        removeQueries: ({ id }) => [
            [...productVariantKeys.detail(id)] as string[],
        ],
        successMessage: "Variant updated successfully",
        errorContext: "Update Variant",
        setError: options?.setError,
    });
}

export function useUpdateProductVariantStatus(options?: BaseMutationOptions) {
    return useGlobalMutation<ProductVariant, { id: number; data: UpdateProductVariantStatusInput }>({
        mutationFn: ({ id, data }) => updateProductVariantStatus(id, data),
        invalidateQueries: [
            [...productVariantKeys.all] as string[],
        ],
        successMessage: (_, { data }) => `Variant status changed to ${data.status}`,
        errorContext: "Update Variant Status",
        setError: options?.setError,
    });
}

export function useAdjustStock(options?: BaseMutationOptions) {
    return useGlobalMutation<null, { id: number; data: StockAdjustmentInput }>({
        mutationFn: ({ id, data }) => adjustStock(id, data),
        invalidateQueries: [
            [...productVariantKeys.all] as string[],
        ],
        removeQueries: ({ id }) => [
            [...productVariantKeys.detail(id)] as string[],
        ],
        successMessage: "Stock adjusted successfully",
        errorContext: "Adjust Stock",
        setError: options?.setError,
    });
}

export function useDeleteProductVariant(options?: BaseMutationOptions) {
    return useGlobalMutation<null, number>({
        mutationFn: deleteProductVariant,
        invalidateQueries: [
            [...productVariantKeys.all] as string[],
        ],
        removeQueries: (id) => [
            [...productVariantKeys.detail(id)] as string[],
        ],
        successMessage: "Variant deleted successfully",
        errorContext: "Delete Variant",
        setError: options?.setError,
    });
}

export function useBulkUpdateProductVariantStatus(options?: BaseMutationOptions) {
    return useGlobalMutation<ProductVariant[], BulkUpdateStatusProductVariantInput>({
        mutationFn: bulkUpdateProductVariantStatus,
        invalidateQueries: [
            [...productVariantKeys.all] as string[],
        ],
        successMessage: (_, { ids }) => `${ids.length} variant(s) updated successfully`,
        errorContext: "Bulk Update Status",
        setError: options?.setError,
    });
}

export function useBulkDeleteProductVariants(options?: BaseMutationOptions) {
    return useGlobalMutation<null, BulkDeleteProductVariantInput>({
        mutationFn: bulkDeleteProductVariants,
        invalidateQueries: [
            [...productVariantKeys.all] as string[],
        ],
        successMessage: (_, { ids }) => `${ids.length} variant(s) deleted successfully`,
        errorContext: "Bulk Delete",
        setError: options?.setError,
    });
}
