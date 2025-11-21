import { getProducts, type GetProductsParams } from "../api/list";
import { useQuery } from "@tanstack/react-query";

export function useProducts(params: GetProductsParams) {
    return useQuery({
        queryKey: ["products", params],
        queryFn: () => getProducts(params),
    });
}
