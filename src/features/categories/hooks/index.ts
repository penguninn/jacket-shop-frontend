import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  updateStatus,
  bulkUpdateStatus,
  bulkDelete,
  type GetCategoriesParams,
} from "../api";
import type { UpdateCategoryInput, UpdateCategoryStatusInput } from "../model/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCategories(params: GetCategoriesParams) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
    staleTime: 30 * 1000,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
    onError: () => { },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryInput }) => updateCategory(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
    onError: () => { },
  });
}

export function useUpdateCategoryStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryStatusInput }) => updateStatus(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
    onError: () => { },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
    onError: () => { },
  });
}

export function useBulkUpdateStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: string }) => bulkUpdateStatus(ids, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
    onError: () => { },
  });
}

export function useBulkDelete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bulkDelete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
    onError: () => { },
  });
}

export function useCategoryDetail(id: number) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
}
