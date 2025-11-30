import {
    getBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand,
    updateBrandStatus,
    bulkUpdateBrandStatus,
    bulkDeleteBrands,
    type GetBrandsParams,
} from "../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpdateBrandInput, UpdateBrandStatusInput } from "../model/schemas";

export function useBrands(params: GetBrandsParams) {
    return useQuery({
        queryKey: ["brands", params],
        queryFn: () => getBrands(params),
    });
}

export function useBrandDetail(id: number) {
    return useQuery({
        queryKey: ["brands", id],
        queryFn: () => getBrandById(id),
        enabled: !!id,
    });
}

export function useCreateBrand() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBrand,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        },
    });
}

export function useUpdateBrand() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateBrandInput }) =>
            updateBrand(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
            queryClient.invalidateQueries({ queryKey: ["brands", variables.id] });
        },
    });
}

export function useDeleteBrand() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBrand,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        },
    });
}

export function useUpdateBrandStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateBrandStatusInput }) =>
            updateBrandStatus(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        },
    });
}

export function useBulkUpdateBrandStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
            bulkUpdateBrandStatus(ids, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        },
    });
}

export function useBulkDeleteBrands() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: bulkDeleteBrands,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        },
    });
}
