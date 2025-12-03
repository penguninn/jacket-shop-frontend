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
} from "../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpdateProductInput, UpdateProductStatusInput } from "../model/schemas";

export function useProducts(params: GetProductsParams) {
    return useQuery({
        queryKey: ["products", params],
        queryFn: () => getProducts(params),
        staleTime: 30 * 1000,
    });
}

export function useCreateProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
        onError: () => { },
    });
}

export function useUpdateProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateProductInput }) =>
            updateProduct(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
        onError: () => { },
    });
}

export function useUpdateProductStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateProductStatusInput }) =>
            updateProductStatus(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
        onError: () => { },
    });
}

export function useDeleteProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
        onError: () => { },
    });
}

export function useBulkUpdateProductStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
            bulkUpdateProductStatus(ids, status),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

export function useBulkDeleteProducts() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: bulkDeleteProducts,
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

export function useBrands() {
    return useQuery({
        queryKey: ["brands"],
        queryFn: getBrands,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useStyles() {
    return useQuery({
        queryKey: ["styles"],
        queryFn: getStyles,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
