import { z } from "zod";
import {
    type BaseFilterParams,
} from "@/shared/api/schemas";

// ============================================
// CONSTANTS
// ============================================

export const ROLE_CONSTANTS = Object.freeze({
    SORT_FIELDS: ["id", "name"] as const,
} as const);

// ============================================
// DOMAIN SCHEMAS
// ============================================

export const roleSchema = z.object({
    id: z.number(),
    name: z.string(),
});

// ============================================
// RESPONSE SCHEMAS
// ============================================

export const rolesResponseSchema = z.array(roleSchema); // Current API returns array, not page

// ============================================
// INPUT SCHEMAS
// ============================================

// Read-only for now, but placeholders for future
export const createRoleSchema = z.object({
    name: z.string(),
});

export const updateRoleSchema = z.object({
    name: z.string(),
});

// ============================================
// FILTER PARAMS SCHEMA
// ============================================

export interface RoleFilterParams extends BaseFilterParams { }

export const roleFilterParamsSchema = z.object({
    page: z.number().min(0).default(0),
    size: z.number().min(1).max(100).default(10),
    search: z.string().optional(),
});

// ============================================
// TYPESCRIPT TYPES
// ============================================

export type Role = z.infer<typeof roleSchema>;
export type RolesResponse = z.infer<typeof rolesResponseSchema>;
