import {
    bulkDeleteProducts,
    bulkUpdateProductStatus,
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
    updateProductStatus,
    getCategories,
    getBrands,
    getMaterials,
    getStyles,
    type GetProductsParams,
    type GetCategoriesParams,
    type GetBrandsParams,
    type GetMaterialsParams,
    type GetStylesParams,
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

// -----------------
// Helper Entities Hooks - For Product Creation/Editing
// -----------------

export function useCategories(params: GetCategoriesParams = {}) {
    const defaultParams: GetCategoriesParams = {
        status: ["ACTIVE"], // Only fetch active categories by default
        size: 100,
        ...params,
    };

    return useQuery({
        queryKey: ["categories", defaultParams],
        queryFn: () => getCategories(defaultParams),
        staleTime: 5 * 60 * 1000, // 5 minutes - categories change less frequently
    });
}

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

export function useMaterials(params: GetMaterialsParams = {}) {
    const defaultParams: GetMaterialsParams = {
        status: ["ACTIVE"], // Only fetch active materials by default
        size: 100,
        ...params,
    };

    return useQuery({
        queryKey: ["materials", defaultParams],
        queryFn: () => getMaterials(defaultParams),
        staleTime: 5 * 60 * 1000, // 5 minutes - materials change less frequently
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
