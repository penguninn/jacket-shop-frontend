
import { createColor, createSize, deleteColor, deleteSize, getColors, updateColor, updateSize, type GetColorsParams } from "../api/attribute";

import type { CreateColorInput, CreateSizeInput, UpdateColorInput, UpdateSizeInput } from "@/schema/attribute";


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
// useSizes.ts
import { useQuery } from "@tanstack/react-query";
import { getSizes, type GetSizesParams } from "../api/attribute";

export function useSizes(params: GetSizesParams) {
  return useQuery({
    queryKey: ["sizes", params],
    queryFn: () => getSizes(params),
    staleTime: 30 * 1000,
  });
}
// useSizeMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";


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
