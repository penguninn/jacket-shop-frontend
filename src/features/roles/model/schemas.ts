import { z } from "zod";
import {
    type BaseFilterParams,
} from "@/shared/api/schemas";


export const ROLE_CONSTANTS = Object.freeze({
    SORT_FIELDS: ["id", "name"] as const,
} as const);


export const roleSchema = z.object({
    id: z.number(),
    name: z.string(),
});


export const rolesResponseSchema = z.array(roleSchema); // Current API returns array, not page


// Read-only for now, but placeholders for future
export const createRoleSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name is too long"),
});

export const updateRoleSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name is too long"),
});


export type RoleFilterParams = BaseFilterParams;

export const roleFilterParamsSchema = z.object({
    page: z.number().min(0).default(0),
    size: z.number().min(1).max(100).default(10),
    search: z.string().optional(),
});


export type Role = z.infer<typeof roleSchema>;
export type RolesResponse = z.infer<typeof rolesResponseSchema>;
