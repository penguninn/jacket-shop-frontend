import z from "zod";
import { userSchema, userStatusEnum } from "@/entities/user";

export const usersResponseSchema = z.object({
  contents: z.array(userSchema),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

export const createUserSchema = z
  .object({
    username: z
      .string()
      .min(6, "Username must be at least 6 characters")
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        "Username can only contain letters, numbers, ., -, _",
      ),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    phone: z
      .string()
      .regex(/^[0-9]{10,15}$/, "Phone must be 10-15 digits")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    status: z.enum(userStatusEnum),
    roleIds: z.array(z.number()).min(1, "Select at least one role"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const updateUserSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Phone must be 10-15 digits")
    .optional()
    .or(z.literal("")),
  status: z.enum(userStatusEnum),
  roleIds: z.array(z.number()).min(1, "Select at least one role"),
});

export const updateUserStatusSchema = z.object({
  status: z.string().min(2, "Status is required"),
});

// Re-export types from entities
export type { User, UserStatus } from "@/entities/user";

// Feature-specific types
export type UsersResponse = z.infer<typeof usersResponseSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
