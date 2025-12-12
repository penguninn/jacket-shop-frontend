import { z } from "zod";
import { userSchema } from "@/features/users/model";

// ============================================
// CONSTANTS
// ============================================
export const AUTH_VALIDATION = {
    USERNAME: {
        MIN_LENGTH: 6,
        MESSAGE: "Username must be at least 6 characters",
    },
    PASSWORD: {
        MIN_LENGTH: 6,
        MESSAGE: "Password must be at least 6 characters",
    },
    FULL_NAME: {
        MIN_LENGTH: 2,
        MESSAGE: "Full name must be at least 2 characters",
    },
    PHONE: {
        MIN_LENGTH: 10,
        MESSAGE: "Phone must be at least 10 digits",
    },
} as const;

// ============================================
// RESPONSE SCHEMAS
// ============================================
export const signInResponseSchema = z.object({
    accessToken: z.string().min(10),
    refreshToken: z.string().min(10),
    user: userSchema,
});

export const signUpResponseSchema = z.null().optional();
export const logoutResponseSchema = z.null().optional();

// ============================================
// INPUT SCHEMAS
// ============================================
export const signInSchema = z.object({
    username: z
        .string()
        .min(AUTH_VALIDATION.USERNAME.MIN_LENGTH, AUTH_VALIDATION.USERNAME.MESSAGE),
    password: z
        .string()
        .min(AUTH_VALIDATION.PASSWORD.MIN_LENGTH, AUTH_VALIDATION.PASSWORD.MESSAGE),
});

export const signUpSchema = z.object({
    username: z
        .string()
        .min(AUTH_VALIDATION.USERNAME.MIN_LENGTH, AUTH_VALIDATION.USERNAME.MESSAGE),
    fullName: z
        .string()
        .min(AUTH_VALIDATION.FULL_NAME.MIN_LENGTH, AUTH_VALIDATION.FULL_NAME.MESSAGE),
    phoneNumber: z
        .string()
        .min(AUTH_VALIDATION.PHONE.MIN_LENGTH, AUTH_VALIDATION.PHONE.MESSAGE),
    password: z
        .string()
        .min(AUTH_VALIDATION.PASSWORD.MIN_LENGTH, AUTH_VALIDATION.PASSWORD.MESSAGE),
});

export const updateProfileSchema = z.object({
    fullName: z
        .string()
        .min(AUTH_VALIDATION.FULL_NAME.MIN_LENGTH, AUTH_VALIDATION.FULL_NAME.MESSAGE),
});

// ============================================
// TYPESCRIPT TYPES
// ============================================
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export type SignInResponse = z.infer<typeof signInResponseSchema>;
export type SignUpResponse = z.infer<typeof signUpResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
