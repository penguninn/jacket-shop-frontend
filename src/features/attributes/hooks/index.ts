import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useGlobalMutation } from "@/shared/hooks/use-global-mutation";
import type { BaseMutationOptions } from "@/shared/api/types";
import {
  bulkDeleteColors,
  bulkDeleteSizes,
  bulkUpdateStatusColors,
  bulkUpdateStatusSizes,
  createColor,
  createSize,
  deleteColor,
  deleteSize,
  getColors,
  getSizes,
  updateColor,
  updateSize,
  type GetColorsParams,
  type GetSizesParams,
  type GetMaterialsParams,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  bulkDeleteMaterials,
  bulkUpdateStatusMaterials,
  getMaterials
} from "../api";
import type {
  CreateColorInput,
  UpdateColorInput,
  CreateSizeInput,
  UpdateSizeInput,
  CreateMaterialInput,
  UpdateMaterialInput
} from "../model/schemas";

// Color Hooks
export function useColors(params: GetColorsParams) {
  return useQuery({
    queryKey: ["colors", params],
    queryFn: () => getColors(params),
    staleTime: 30 * 1000,
  });
}

export function useCreateColor(options?: BaseMutationOptions) {
  const qc = useQueryClient();
  return useGlobalMutation({
    mutationFn: (payload: CreateColorInput) => createColor(payload),
    setError: options?.setError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["colors"] });
    },
  });
}

export function useUpdateColor(options?: BaseMutationOptions) {
  const qc = useQueryClient();
  return useGlobalMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateColorInput }) => updateColor(id, data),
    setError: options?.setError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["colors"] });
    },
  });
}

export function useDeleteColor(options?: BaseMutationOptions) {
  const qc = useQueryClient();
  return useGlobalMutation({
    mutationFn: (id: number) => deleteColor(id),
    setError: options?.setError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["colors"] });
    },
  });
}

// Size Hooks
export function useSizes(params: GetSizesParams) {
  return useQuery({
    queryKey: ["sizes", params],
    queryFn: () => getSizes(params),
    staleTime: 30 * 1000,
  });
}

export function useCreateSize(options?: BaseMutationOptions) {
  const qc = useQueryClient();
  return useGlobalMutation({
    mutationFn: (payload: CreateSizeInput) => createSize(payload),
    setError: options?.setError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sizes"] });
    },
  });
}

export function useUpdateSize(options?: BaseMutationOptions) {
  const qc = useQueryClient();
  return useGlobalMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSizeInput }) => updateSize(id, data),
    setError: options?.setError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sizes"] });
    },
  });
}

export function useDeleteSize(options?: BaseMutationOptions) {
  const qc = useQueryClient();
  return useGlobalMutation({
    mutationFn: (id: number) => deleteSize(id),
    setError: options?.setError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sizes"] });
    },
  });
}

// Bulk Operations
export function useBulkDeleteColors(options?: BaseMutationOptions) {
  const qc = useQueryClient();
  return useGlobalMutation({
    mutationFn: (ids: number[]) => bulkDeleteColors(ids),
    setError: options?.setError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["colors"] });
    },
  });
}

export function useBulkDeleteSizes(options?: BaseMutationOptions) {
  const qc = useQueryClient();
  return useGlobalMutation({
    mutationFn: (ids: number[]) => bulkDeleteSizes(ids),
    setError: options?.setError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sizes"] });
    },
  });
}

export function useBulkUpdateStatusColors(options?: BaseMutationOptions) {
  const qc = useQueryClient();
  return useGlobalMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
      bulkUpdateStatusColors(ids, status),
    setError: options?.setError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["colors"] });
    },
  });
}

export function useBulkUpdateStatusSizes(options?: BaseMutationOptions) {
  const qc = useQueryClient();
  return useGlobalMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
      bulkUpdateStatusSizes(ids, status),
    setError: options?.setError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sizes"] });
    },
  });
}

// Material Hooks
export function useMaterials(params: GetMaterialsParams) {
  return useQuery({
    queryKey: ["materials", params],
    queryFn: () => getMaterials(params),
    staleTime: 30 * 1000,
  });
}

export function useCreateMaterial(options?: BaseMutationOptions) {
  const qc = useQueryClient();
  return useGlobalMutation({
    mutationFn: (payload: CreateMaterialInput) => createMaterial(payload),
    setError: options?.setError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}

export function useUpdateMaterial(options?: BaseMutationOptions) {
  const qc = useQueryClient();
  return useGlobalMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMaterialInput }) => updateMaterial(id, data),
    setError: options?.setError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}

export function useDeleteMaterial(options?: BaseMutationOptions) {
  const qc = useQueryClient();
  return useGlobalMutation({
    mutationFn: (id: number) => deleteMaterial(id),
    setError: options?.setError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}

export function useBulkDeleteMaterials(options?: BaseMutationOptions) {
  const qc = useQueryClient();
  return useGlobalMutation({
    mutationFn: (ids: number[]) => bulkDeleteMaterials(ids),
    setError: options?.setError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}

export function useBulkUpdateStatusMaterials(options?: BaseMutationOptions) {
  const qc = useQueryClient();
  return useGlobalMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
      bulkUpdateStatusMaterials(ids, status),
    setError: options?.setError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}
