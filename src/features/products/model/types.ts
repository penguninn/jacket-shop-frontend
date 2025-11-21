import z from "zod";
import {
    createProductSchema,
    productsResponseSchema,
    updateProductSchema,
    updateProductStatusSchema,
} from "./schemas";

export type ProductsResponse = z.infer<typeof productsResponseSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type UpdateProductStatusInput = z.infer<
    typeof updateProductStatusSchema
>;
