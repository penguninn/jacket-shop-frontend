import z from "zod";
import { productSchema } from "@/entities/product";

export const productsResponseSchema = z.object({
    contents: z.array(productSchema),
    page: z.number(),
    size: z.number(),
    totalPages: z.number(),
    totalElements: z.number(),
});

export const createProductSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    category: z.number(),
    brand: z.number(),
    description: z.string().optional().or(z.literal("")),
    material: z.number().optional(),
    style: z.number().optional(),
    imagesJson: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const updateProductSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    category: z.number(),
    brand: z.number(),
    description: z.string().optional().or(z.literal("")),
    material: z.number().optional(),
    style: z.number().optional(),
    imagesJson: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const updateProductStatusSchema = z.object({
    status: z.string().min(2, "Status is required"),
});
