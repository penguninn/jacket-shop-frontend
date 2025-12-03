import {
    getStyles,
    getStyleById,
    createStyle,
    updateStyle,
    deleteStyle,
    updateStyleStatus,
    bulkUpdateStyleStatus,
    bulkDeleteStyles,
    type GetStylesParams,
} from "../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpdateStyleInput, UpdateStyleStatusInput } from "../model/schemas";

export function useStyles(params: GetStylesParams) {
    return useQuery({
        queryKey: ["styles", params],
        queryFn: () => getStyles(params),
    });
}

export function useStyleDetail(id: number) {
    return useQuery({
        queryKey: ["styles", id],
        queryFn: () => getStyleById(id),
        enabled: !!id,
    });
}

export function useCreateStyle() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createStyle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["styles"] });
        },
    });
}

export function useUpdateStyle() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateStyleInput }) =>
            updateStyle(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["styles"] });
            queryClient.invalidateQueries({ queryKey: ["styles", variables.id] });
        },
    });
}

export function useDeleteStyle() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteStyle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["styles"] });
        },
    });
}

export function useUpdateStyleStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateStyleStatusInput }) =>
            updateStyleStatus(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["styles"] });
        },
    });
}

export function useBulkUpdateStyleStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
            bulkUpdateStyleStatus(ids, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["styles"] });
        },
    });
}

export function useBulkDeleteStyles() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: bulkDeleteStyles,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["styles"] });
        },
    });
}
