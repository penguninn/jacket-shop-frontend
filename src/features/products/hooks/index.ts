import {
    bulkDeleteProducts,
    bulkUpdateProductStatus,
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
    updateProductStatus,
    getBrands,
    getStyles,
    type GetProductsParams,
    type GetBrandsParams,
    type GetStylesParams,
} from "../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useGlobalMutation } from "@/shared/hooks/use-global-mutation";
import type { BaseMutationOptions } from "@/shared/api/types";
import type { UpdateProductInput, UpdateProductStatusInput } from "../model/schemas";

export function useProducts(params: GetProductsParams) {
    return useQuery({
        queryKey: ["products", params],
        queryFn: () => getProducts(params),
        staleTime: 30 * 1000,
    });
}

export function useCreateProduct(options?: BaseMutationOptions) {
    const qc = useQueryClient();
    return useGlobalMutation({
        mutationFn: createProduct,
        setError: options?.setError,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

export function useUpdateProduct(options?: BaseMutationOptions) {
    const qc = useQueryClient();
    return useGlobalMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateProductInput }) =>
            updateProduct(id, data),
        setError: options?.setError,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

export function useUpdateProductStatus(options?: BaseMutationOptions) {
    const qc = useQueryClient();
    return useGlobalMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateProductStatusInput }) =>
            updateProductStatus(id, data),
        setError: options?.setError,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

export function useDeleteProduct(options?: BaseMutationOptions) {
    const qc = useQueryClient();
    return useGlobalMutation({
        mutationFn: deleteProduct,
        setError: options?.setError,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

export function useBulkUpdateProductStatus(options?: BaseMutationOptions) {
    const qc = useQueryClient();
    return useGlobalMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
            bulkUpdateProductStatus(ids, status),
        setError: options?.setError,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

export function useBulkDeleteProducts(options?: BaseMutationOptions) {
    const qc = useQueryClient();
    return useGlobalMutation({
        mutationFn: bulkDeleteProducts,
        setError: options?.setError,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

export function useProductDetail(id: number) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(id),
        enabled: !!id,
    });
}

// -----------------
// Helper Entities Hooks - For Product Creation/Editing
// -----------------



export function useBrands(params: GetBrandsParams = {}) {
    const defaultParams: GetBrandsParams = {
        status: "ACTIVE", // Only fetch active brands by default
        size: 100,
        ...params,
    };

    return useQuery({
        queryKey: ["brands", defaultParams],
        queryFn: () => getBrands(defaultParams),
        staleTime: 5 * 60 * 1000, // 5 minutes - brands change less frequently
    });
}

export function useStyles(params: GetStylesParams = {}) {
    const defaultParams: GetStylesParams = {
        status: "ACTIVE", // Only fetch active styles by default
        size: 100,
        ...params,
    };

    return useQuery({
        queryKey: ["styles", defaultParams],
        queryFn: () => getStyles(defaultParams),
        staleTime: 5 * 60 * 1000, // 5 minutes - styles change less frequently
    });
}
