import z from "zod";

// Status enum from backend
export const styleStatusEnum = ["ACTIVE", "INACTIVE"] as const;

// Style schema based on backend StyleResponse
export const styleSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable().optional(),
    status: z.enum(styleStatusEnum),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
});

export type Style = z.infer<typeof styleSchema>;
export type StyleStatus = typeof styleStatusEnum[number];

// Paginated response
export const stylesResponseSchema = z.object({
    contents: z.array(styleSchema),
    page: z.number(),
    size: z.number(),
    totalPages: z.number(),
    totalElements: z.number(),
});

// Create style input schema based on StyleRequest
export const createStyleSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must not exceed 100 characters"),
    description: z.string().max(255, "Description must not exceed 255 characters").optional(),
    status: z.enum(styleStatusEnum),
});

// Update style input schema
export const updateStyleSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must not exceed 100 characters"),
    description: z.string().max(255, "Description must not exceed 255 characters").optional(),
    status: z.enum(styleStatusEnum),
});

// Update style status schema
export const updateStyleStatusSchema = z.object({
    status: z.enum(styleStatusEnum),
});

// Feature-specific types
export type StylesResponse = z.infer<typeof stylesResponseSchema>;
export type CreateStyleInput = z.infer<typeof createStyleSchema>;
export type UpdateStyleInput = z.infer<typeof updateStyleSchema>;
export type UpdateStyleStatusInput = z.infer<typeof updateStyleStatusSchema>;
