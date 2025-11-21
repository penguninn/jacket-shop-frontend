import {
  bulkDeleteProductVariants,
  bulkUpdateProductVariantStatus,
  createProductVariant,
  deleteProductVariant,
  getProductVariantById,
  getProductVariants,
  updateProductVariant,
  updateProductVariantStatus,
  type GetProductVariantsParams,
} from "../api";
import type { UpdateProductVariantInput } from "../model/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProductVariants(params: GetProductVariantsParams) {
  return useQuery({
    queryKey: ["product-variants", params],
    queryFn: () => getProductVariants(params),
  });
}

export function useCreateProductVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProductVariant,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["product-variants"] });
    },
    onError: () => { },
  });
}

export function useUpdateProductVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateProductVariantInput;
    }) => updateProductVariant(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["product-variants"] });
    },
    onError: () => { },
  });
}

export function useUpdateProductVariantStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateProductVariantStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["product-variants"] });
    },
    onError: () => { },
  });
}

export function useDeleteProductVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProductVariant,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["product-variants"] });
    },
    onError: () => { },
  });
}

export function useBulkUpdateProductVariantStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
      bulkUpdateProductVariantStatus(ids, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["product-variants"] });
    },
  });
}

export function useBulkDeleteProductVariants() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteProductVariants,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["product-variants"] });
    },
  });
}

export function useProductVariantDetail(id: number) {
  return useQuery({
    queryKey: ["product-variant", id],
    queryFn: () => getProductVariantById(id),
    enabled: !!id,
  });
}
