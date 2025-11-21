import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  type GetSizesParams
} from "../api";
import type {
  CreateColorInput,
  UpdateColorInput,
  CreateSizeInput,
  UpdateSizeInput
} from "../model/schemas";

// Color Hooks
export function useColors(params: GetColorsParams) {
  return useQuery({
    queryKey: ["colors", params],
    queryFn: () => getColors(params),
    staleTime: 30 * 1000,
  });
}

export function useCreateColor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateColorInput) => createColor(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["colors"] });
    },
  });
}

export function useUpdateColor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateColorInput }) => updateColor(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["colors"] });
    },
  });
}

export function useDeleteColor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteColor(id),
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

export function useCreateSize() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSizeInput) => createSize(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sizes"] });
    },
  });
}

export function useUpdateSize() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSizeInput }) => updateSize(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sizes"] });
    },
  });
}

export function useDeleteSize() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSize(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sizes"] });
    },
  });
}

// Bulk Operations
export function useBulkDeleteColors() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => bulkDeleteColors(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["colors"] });
    },
  });
}

export function useBulkDeleteSizes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => bulkDeleteSizes(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sizes"] });
    },
  });
}

export function useBulkUpdateStatusColors() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
      bulkUpdateStatusColors(ids, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["colors"] });
    },
  });
}

export function useBulkUpdateStatusSizes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
      bulkUpdateStatusSizes(ids, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sizes"] });
    },
  });
}
