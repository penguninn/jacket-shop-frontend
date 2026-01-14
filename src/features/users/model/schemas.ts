// features/users/model/schemas.ts
import { z } from "zod";
import {
  statusSchema,
  pageResponseSchema,
  type BaseFilterParams,
} from "@/shared/api/schemas";


export const USER_CONSTANTS = Object.freeze({
  USERNAME: {
    MIN_LENGTH: 6,
    REGEX: /^[a-zA-Z0-9._-]+$/,
  },
  FULL_NAME: {
    MIN_LENGTH: 2,
  },
  PHONE: {
    REGEX: /^0[0-9]{9,14}$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    UPPERCASE_REGEX: /[A-Z]/,
    NUMBER_REGEX: /[0-9]/,
  },
  SORT_FIELDS: ['id', 'username', 'fullName', 'createdAt', 'updatedAt'] as const,
} as const);


export const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const userSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  username: z.string(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  status: statusSchema,
  emailVerified: z.boolean().nullable().optional(),
  phoneVerified: z.boolean().nullable().optional(),
  lastLoginAt: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  roles: z.array(roleSchema),
});


export const usersResponseSchema = pageResponseSchema(userSchema);

export const loginHistorySchema = z.object({
  id: z.number(),
  ipAddress: z.string(),
  device: z.string(),
  location: z.string().nullable(),
  loginAt: z.string(),
});

export const auditLogSchema = z.object({
  id: z.number(),
  action: z.string(),
  description: z.string(),
  createdAt: z.string(),
});

export const userStatisticsSchema = z.object({
  ordersCount: z.number(),
  revenue: z.number(),
  avgHandlingTime: z.number(),
  customerRating: z.number().nullable(),
});


export const createUserSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(120, "Full name must be less than 120 characters"),
    username: z
      .string()
      .min(6, "Username must be at least 6 characters")
      .max(50, "Username must be less than 50 characters")
      .regex(
        USER_CONSTANTS.USERNAME.REGEX,
        "Username can only contain letters, numbers, ., -, _"
      ),
    status: statusSchema,
    roleIds: z.array(z.number()).min(1, "Select at least one role"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters"),
    confirmPassword: z.string(),
    phone: z
      .string()
      .regex(USER_CONSTANTS.PHONE.REGEX, "Phone number must start with 0 and have 10-15 digits")
      .nullable()
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const updateUserSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(120, "Full name must be less than 120 characters"),
  status: statusSchema,
  roleIds: z.array(z.number()).min(1, "Select at least one role"),
  phone: z
    .string()
    .regex(USER_CONSTANTS.PHONE.REGEX, "Phone number must start with 0 and have 10-15 digits")
    .nullable()
    .optional()
    .or(z.literal("")),
});

export const updateUserStatusSchema = z.object({
  status: statusSchema,
});

export const bulkUpdateStatusSchema = z.object({
  ids: z.array(z.number()).min(1, "Select at least one user"),
  status: statusSchema,
});

export const bulkDeleteSchema = z.object({
  ids: z.array(z.number()).min(1, "Select at least one user"),
});


export interface UserFilterParams extends BaseFilterParams {
  roles?: string[];
}

export const userFilterParamsSchema = z.object({
  page: z.number().min(0).default(0),
  size: z.number().min(1).max(100).default(10),
  sortBy: z.enum(USER_CONSTANTS.SORT_FIELDS).default("createdAt"),
  sortDir: z.enum(["ASC", "DESC"]).default("DESC"),
  search: z.string().optional(),
  status: z.array(statusSchema).optional(),
  roles: z.array(z.string()).optional(),
});


export type User = z.infer<typeof userSchema>;
export type Role = z.infer<typeof roleSchema>;
export type UserStatus = z.infer<typeof statusSchema>;
export type UsersResponse = z.infer<typeof usersResponseSchema>;

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type BulkUpdateStatusInput = z.infer<typeof bulkUpdateStatusSchema>;
export type BulkDeleteInput = z.infer<typeof bulkDeleteSchema>;

export type LoginHistory = z.infer<typeof loginHistorySchema>;
export type AuditLog = z.infer<typeof auditLogSchema>;
export type UserStatistics = z.infer<typeof userStatisticsSchema>;
