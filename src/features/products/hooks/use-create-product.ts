import { createProduct } from "../api/create";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
        onError: () => { },
    });
}
