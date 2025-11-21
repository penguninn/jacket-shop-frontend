import { updateProduct, updateProductStatus, bulkUpdateProductStatus } from "../api/update";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateProductStatusInput } from "../model/types";

export function useUpdateProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            updateProduct(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
        onError: () => { },
    });
}

export function useUpdateProductStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: UpdateProductStatusInput;
        }) => updateProductStatus(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
        onError: () => { },
    });
}

export function useBulkUpdateProductStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
            bulkUpdateProductStatus(ids, status),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
    });
}
