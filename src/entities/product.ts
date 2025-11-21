import z from "zod";

export const productStatusEnum = ["ACTIVE", "INACTIVE"] as const;

export const productSchema = z.object({
    id: z.number(),
    name: z.string(),
    category: z.object({ id: z.number(), name: z.string() }),
    brand: z.object({ id: z.number(), name: z.string() }),
    description: z.string().nullable(),
    material: z.object({ id: z.number(), name: z.string() }).nullable(),
    style: z.object({ id: z.number(), name: z.string() }).nullable(),
    imagesJson: z.string().nullable(),
    status: z.enum(productStatusEnum),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductStatus = z.infer<typeof productSchema>["status"];
