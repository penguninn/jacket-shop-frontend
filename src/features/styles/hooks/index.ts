import {
    getStyles,
    getPublicStyles,
    getStyleById,
    createStyle,
    updateStyle,
    deleteStyle,
    updateStyleStatus,
    bulkUpdateStyleStatus,
    bulkDeleteStyles,
    importStyles,
    type GetStylesParams,
} from "../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useGlobalMutation } from "@/shared/hooks/use-global-mutation";
import type { BaseMutationOptions } from "@/shared/api/types";
import type { UpdateStyleInput, UpdateStyleStatusInput } from "../model/schemas";

export function useStyles(params: GetStylesParams) {
    return useQuery({
        queryKey: ["styles", params],
        queryFn: () => getStyles(params),
    });
}

export function usePublicStyles(params: GetStylesParams) {
    return useQuery({
        queryKey: ["public-styles", params],
        queryFn: () => getPublicStyles(params),
    });
}

export function useStyleDetail(id: number) {
    return useQuery({
        queryKey: ["styles", id],
        queryFn: () => getStyleById(id),
        enabled: !!id,
    });
}

export function useCreateStyle(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();
    return useGlobalMutation({
        mutationFn: createStyle,
        setError: options?.setError,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["styles"] });
        },
    });
}

export function useUpdateStyle(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();
    return useGlobalMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateStyleInput }) =>
            updateStyle(id, data),
        setError: options?.setError,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["styles"] });
            queryClient.invalidateQueries({ queryKey: ["styles", variables.id] });
        },
    });
}

export function useDeleteStyle(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();
    return useGlobalMutation({
        mutationFn: deleteStyle,
        setError: options?.setError,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["styles"] });
        },
    });
}

export function useUpdateStyleStatus(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();
    return useGlobalMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateStyleStatusInput }) =>
            updateStyleStatus(id, data),
        setError: options?.setError,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["styles"] });
        },
    });
}

export function useBulkUpdateStyleStatus(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();
    return useGlobalMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
            bulkUpdateStyleStatus(ids, status),
        setError: options?.setError,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["styles"] });
        },
    });
}

export function useBulkDeleteStyles(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();
    return useGlobalMutation({
        mutationFn: bulkDeleteStyles,
        setError: options?.setError,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["styles"] });
        },
    });
}

export function useImportStyles(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();
    return useGlobalMutation({
        mutationFn: importStyles,
        setError: options?.setError,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["styles"] });
        },
    });
}
