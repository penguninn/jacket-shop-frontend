import { deleteProduct, bulkDeleteProducts } from "../api/delete";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
        onError: () => { },
    });
}

export function useBulkDeleteProducts() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: bulkDeleteProducts,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
    });
}
