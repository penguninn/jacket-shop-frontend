import { httpPrivateTyped } from "@/shared/api/http-typed";
import z from "zod";

export async function deleteProduct(id: number) {
    await httpPrivateTyped.del(`/products/${id}`, z.null());
}

export async function bulkDeleteProducts(ids: number[]) {
    await httpPrivateTyped.post("/products/bulk/delete", { ids }, z.null());
}
