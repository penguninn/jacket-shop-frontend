import z from "zod";

export const materialStatusEnum = ["ACTIVE", "INACTIVE"] as const;

export const materialSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable().optional(),
    status: z.enum(materialStatusEnum),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
});

export type Material = z.infer<typeof materialSchema>;
export type MaterialStatus = typeof materialStatusEnum[number];

export const materialsResponseSchema = z.object({
    contents: z.array(materialSchema),
    page: z.number(),
    size: z.number(),
    totalPages: z.number(),
    totalElements: z.number(),
});

export const createMaterialSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be less than 100 characters"),
    description: z
        .string()
        .max(255, "Description must be less than 255 characters")
        .optional()
        .nullable(),
    status: z.enum(materialStatusEnum),
});

export const updateMaterialSchema = createMaterialSchema;

export const updateMaterialStatusSchema = z.object({
    status: z.enum(materialStatusEnum),
});

// Feature-specific types
export type MaterialsResponse = z.infer<typeof materialsResponseSchema>;
export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;
export type UpdateMaterialInput = z.infer<typeof updateMaterialSchema>;
export type UpdateMaterialStatusInput = z.infer<typeof updateMaterialStatusSchema>;
