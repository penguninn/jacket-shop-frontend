import { httpPrivateTyped } from "@/shared/api/http-typed";
import { productSchema } from "@/entities/product";

export async function getProductById(id: number) {
    const res = await httpPrivateTyped.get(`/products/${id}`, productSchema);
    return res;
}
