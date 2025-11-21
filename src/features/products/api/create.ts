import { httpPrivateTyped } from "@/shared/api/http-typed";
import { productSchema } from "@/entities/product";
import type { CreateProductInput } from "../model/types";

export async function createProduct(payload: CreateProductInput) {
    const res = await httpPrivateTyped.post("/products", payload, productSchema);
    return res;
}
