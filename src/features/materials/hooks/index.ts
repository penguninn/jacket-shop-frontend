import {
    bulkDelete,
    bulkUpdateStatus,
    createMaterial,
    deleteMaterial,
    getMaterialById,
    getMaterials,
    updateStatus,
    updateMaterial,
    type GetMaterialsParams,
} from "../api";
import type { UpdateMaterialInput, UpdateMaterialStatusInput } from "../model/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useMaterials(params: GetMaterialsParams) {
    return useQuery({
        queryKey: ["materials", params],
        queryFn: () => getMaterials(params),
        staleTime: 30 * 1000,
    });
}

export function useCreateMaterial() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createMaterial,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["materials"] });
        },
        onError: () => { },
    });
}

export function useUpdateMaterial() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateMaterialInput }) =>
            updateMaterial(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["materials"] });
        },
        onError: () => { },
    });
}

export function useUpdateMaterialStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateMaterialStatusInput }) =>
            updateStatus(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["materials"] });
        },
        onError: (error) => {
            console.error("Failed to update status:", error);
        },
    });
}

export function useDeleteMaterial() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteMaterial,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["materials"] });
        },
        onError: () => { },
    });
}

export function useBulkUpdateStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
            bulkUpdateStatus(ids, status),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["materials"] });
        },
    });
}

export function useBulkDelete() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: bulkDelete,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["materials"] });
        },
    });
}

export function useMaterialDetail(id: number) {
    return useQuery({
        queryKey: ["material", id],
        queryFn: () => getMaterialById(id),
        enabled: !!id,
    });
}
