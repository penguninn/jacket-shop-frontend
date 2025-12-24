import {
  getBrands,
  getPublicBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  updateBrandStatus,
  bulkUpdateBrandStatus,
  bulkDeleteBrands,
  importBrands,
  type GetBrandsParams,
} from "../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useGlobalMutation } from "@/shared/hooks/use-global-mutation";
import type { BaseMutationOptions } from "@/shared/api/types";
import type {
  UpdateBrandInput,
  UpdateBrandStatusInput,
} from "../model/schemas";

export function useBrands(params: GetBrandsParams) {
  return useQuery({
    queryKey: ["brands", params],
    queryFn: () => getBrands(params),
  });
}

export function usePublicBrands(params: GetBrandsParams) {
  return useQuery({
    queryKey: ["public-brands", params],
    queryFn: () => getPublicBrands(params),
  });
}

export function useBrandDetail(id: number) {
  return useQuery({
    queryKey: ["brands", id],
    queryFn: () => getBrandById(id),
    enabled: !!id,
  });
}

export function useCreateBrand(options?: BaseMutationOptions) {
  const queryClient = useQueryClient();
  return useGlobalMutation({
    mutationFn: createBrand,
    setError: options?.setError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}

export function useUpdateBrand(options?: BaseMutationOptions) {
  const queryClient = useQueryClient();
  return useGlobalMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBrandInput }) =>
      updateBrand(id, data),
    setError: options?.setError,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["brands", variables.id] });
    },
  });
}

export function useDeleteBrand(options?: BaseMutationOptions) {
  const queryClient = useQueryClient();
  return useGlobalMutation({
    mutationFn: deleteBrand,
    setError: options?.setError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}

export function useUpdateBrandStatus(options?: BaseMutationOptions) {
  const queryClient = useQueryClient();
  return useGlobalMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBrandStatusInput }) =>
      updateBrandStatus(id, data),
    setError: options?.setError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}

export function useBulkUpdateBrandStatus(options?: BaseMutationOptions) {
  const queryClient = useQueryClient();
  return useGlobalMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
      bulkUpdateBrandStatus(ids, status),
    setError: options?.setError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}

export function useBulkDeleteBrands(options?: BaseMutationOptions) {
  const queryClient = useQueryClient();
  return useGlobalMutation({
    mutationFn: bulkDeleteBrands,
    setError: options?.setError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}

export function useImportBrands(options?: BaseMutationOptions) {
  const queryClient = useQueryClient();
  return useGlobalMutation({
    mutationFn: importBrands,
    setError: options?.setError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}
