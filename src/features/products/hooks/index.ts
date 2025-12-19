import { useQuery } from "@tanstack/react-query";
import { useGlobalMutation } from "@/shared/hooks/use-global-mutation";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    updateProductStatus,
    deleteProduct,
    bulkUpdateProductStatus,
    bulkDeleteProducts,
    getBrands,
    getStyles,
    getPublicProducts,
    getPublicProductById,
    type HelperEntityParams,
} from "../api";
import type {
    Product,
    ProductFilterParams,
    CreateProductInput,
    UpdateProductInput,
    UpdateProductStatusInput,
    BulkUpdateStatusProductInput,
    BulkDeleteProductInput,
} from "../model/schemas";
import type { BaseMutationOptions } from "@/shared/api/types";


export const productKeys = {
    all: ['products'] as const,
    lists: () => [...productKeys.all, 'list'] as const,
    list: (params: ProductFilterParams) => [...productKeys.lists(), params] as const,
    details: () => [...productKeys.all, 'detail'] as const,
    detail: (id: number) => [...productKeys.details(), id] as const,
    // Helpers
    brands: (params: HelperEntityParams) => ['brands', 'list', params] as const,
    styles: (params: HelperEntityParams) => ['styles', 'list', params] as const,
} as const;


export function useProducts(params: ProductFilterParams) {
    return useQuery({
        queryKey: productKeys.list(params),
        queryFn: () => getProducts(params),
    });
}

export function usePublicProducts(params: ProductFilterParams) {
    return useQuery({
        queryKey: [...productKeys.list(params), 'public'],
        queryFn: () => getPublicProducts(params),
    });
}

export function useProductDetail(id: number, enabled = true) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => getProductById(id),
        enabled: enabled && !!id,
    });
}

export function usePublicProductDetail(id: number, enabled = true) {
    return useQuery({
        queryKey: [...productKeys.detail(id), 'public'],
        queryFn: () => getPublicProductById(id),
        enabled: enabled && !!id,
    });
}

export function useBrands(params: HelperEntityParams = {}) {
    const defaultParams: HelperEntityParams = {
        status: "ACTIVE", // Default to active
        size: 100,
        ...params,
    };
    return useQuery({
        queryKey: productKeys.brands(defaultParams),
        queryFn: () => getBrands(defaultParams),
        staleTime: 5 * 60 * 1000,
    });
}

export function useStyles(params: HelperEntityParams = {}) {
    const defaultParams: HelperEntityParams = {
        status: "ACTIVE", // Default to active
        size: 100,
        ...params,
    };
    return useQuery({
        queryKey: productKeys.styles(defaultParams),
        queryFn: () => getStyles(defaultParams),
        staleTime: 5 * 60 * 1000,
    });
}


export function useCreateProduct(options?: BaseMutationOptions) {
    return useGlobalMutation<Product, CreateProductInput>({
        mutationFn: createProduct,
        invalidateQueries: [
            [...productKeys.lists()] as string[],
        ],
        successMessage: "Product created successfully",
        errorContext: "Create Product",
        setError: options?.setError,
    });
}

export function useUpdateProduct(options?: BaseMutationOptions) {
    return useGlobalMutation<Product, { id: number; data: UpdateProductInput }>({
        mutationFn: ({ id, data }) => updateProduct(id, data),
        invalidateQueries: [
            [...productKeys.lists()] as string[],
            [...productKeys.details()] as string[],
        ],
        removeQueries: ({ id }) => [
            [...productKeys.detail(id)] as string[],
        ],
        successMessage: "Product updated successfully",
        errorContext: "Update Product",
        setError: options?.setError,
    });
}

export function useUpdateProductStatus(options?: BaseMutationOptions) {
    return useGlobalMutation<Product, { id: number; data: UpdateProductStatusInput }>({
        mutationFn: ({ id, data }) => updateProductStatus(id, data),
        invalidateQueries: [
            [...productKeys.lists()] as string[],
            [...productKeys.details()] as string[],
        ],
        successMessage: (_, { data }) => `Product status changed to ${data.status}`,
        errorContext: "Update Product Status",
        setError: options?.setError,
    });
}

export function useDeleteProduct(options?: BaseMutationOptions) {
    return useGlobalMutation<null, number>({
        mutationFn: deleteProduct,
        invalidateQueries: [
            [...productKeys.lists()] as string[],
        ],
        removeQueries: (id) => [
            [...productKeys.detail(id)] as string[],
        ],
        successMessage: "Product deleted successfully",
        errorContext: "Delete Product",
        setError: options?.setError,
    });
}

export function useBulkUpdateProductStatus(options?: BaseMutationOptions) {
    return useGlobalMutation<Product[], BulkUpdateStatusProductInput>({
        mutationFn: bulkUpdateProductStatus,
        invalidateQueries: [
            [...productKeys.lists()] as string[],
            [...productKeys.details()] as string[],
        ],
        successMessage: (_, { ids }) => `${ids.length} product(s) updated successfully`,
        errorContext: "Bulk Update Status",
        setError: options?.setError,
    });
}

export function useBulkDeleteProducts(options?: BaseMutationOptions) {
    return useGlobalMutation<null, BulkDeleteProductInput>({
        mutationFn: bulkDeleteProducts,
        invalidateQueries: [
            [...productKeys.lists()] as string[],
        ],
        successMessage: (_, { ids }) => `${ids.length} product(s) deleted successfully`,
        errorContext: "Bulk Delete",
        setError: options?.setError,
    });
}
