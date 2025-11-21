import { getProductById } from "../api/detail";
import { useQuery } from "@tanstack/react-query";

export function useProductDetail(id: number) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(id),
        enabled: !!id,
    });
}
