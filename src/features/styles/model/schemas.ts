import { z } from "zod";
import {
    statusSchema,
    pageResponseSchema,
    type BaseFilterParams,
} from "@/shared/api/schemas";


export const STYLE_CONSTANTS = Object.freeze({
    NAME: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 120,
    },
    DESCRIPTION: {
        MAX_LENGTH: 255,
    },
    SORT_FIELDS: ["id", "name", "createdAt", "updatedAt"] as const,
} as const);


export const styleSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable().optional(),
    status: statusSchema,
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
});


export const stylesResponseSchema = pageResponseSchema(styleSchema);


export const createStyleSchema = z.object({
    name: z
        .string()
        .min(
            STYLE_CONSTANTS.NAME.MIN_LENGTH,
            "Name cannot be empty"
        )
        .max(
            STYLE_CONSTANTS.NAME.MAX_LENGTH,
            "Name must be less than 120 characters"
        ),
    description: z
        .string()
        .max(
            STYLE_CONSTANTS.DESCRIPTION.MAX_LENGTH,
            "Description too long"
        )
        .optional(),
    status: statusSchema,
});

export const updateStyleSchema = z.object({
    id: z.number(),
    name: z
        .string()
        .min(
            STYLE_CONSTANTS.NAME.MIN_LENGTH,
            "Name cannot be empty"
        )
        .max(
            STYLE_CONSTANTS.NAME.MAX_LENGTH,
            "Name must be less than 120 characters"
        ),
    description: z
        .string()
        .max(
            STYLE_CONSTANTS.DESCRIPTION.MAX_LENGTH,
            "Description too long"
        )
        .optional(),
    status: statusSchema,
});

export const updateStyleStatusSchema = z.object({
    status: statusSchema,
});

export const bulkUpdateStatusStyleSchema = z.object({
    ids: z.array(z.number()).min(1, "Select at least one style"),
    status: statusSchema,
});

export const bulkDeleteStyleSchema = z.object({
    ids: z.array(z.number()).min(1, "Select at least one style"),
});


export type StyleFilterParams = BaseFilterParams;

export const styleFilterParamsSchema = z.object({
    page: z.number().min(0).default(0),
    size: z.number().min(1).max(100).default(10),
    sortBy: z.enum(STYLE_CONSTANTS.SORT_FIELDS).default("createdAt"),
    sortDir: z.enum(["ASC", "DESC"]).default("DESC"),
    search: z.string().optional(),
    status: z.array(statusSchema).optional(),
});


export type Style = z.infer<typeof styleSchema>;
export type StyleStatus = z.infer<typeof statusSchema>;
export type StylesResponse = z.infer<typeof stylesResponseSchema>;

export type CreateStyleInput = z.infer<typeof createStyleSchema>;
export type UpdateStyleInput = z.infer<typeof updateStyleSchema>;
export type UpdateStyleStatusInput = z.infer<typeof updateStyleStatusSchema>;
export type BulkUpdateStatusStyleInput = z.infer<typeof bulkUpdateStatusStyleSchema>;
export type BulkDeleteStyleInput = z.infer<typeof bulkDeleteStyleSchema>;

// Import result schema (matches backend ImportResult)
export const importResultSchema = z.object({
    totalRows: z.number(),
    successCount: z.number(),
    errorCount: z.number(),
    errorDetails: z.array(z.string()),
});

export type ImportResult = z.infer<typeof importResultSchema>;
