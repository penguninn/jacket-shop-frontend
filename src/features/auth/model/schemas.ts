import { z } from "zod";
import { userSchema } from "@/features/users/model";

export const AUTH_VALIDATION = {
    USERNAME: {
        MIN_LENGTH: 6,
        MAX_LENGTH: 50,
        MESSAGE: "Username must be between 6 and 50 characters",
    },
    PASSWORD: {
        MIN_LENGTH: 1, // NotBlank for login
        MESSAGE: "Password is required",
        PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
        PATTERN_MESSAGE: "Password must contain at least one uppercase letter, one lowercase letter and one number",
    },
    FULL_NAME: {
        MAX_LENGTH: 150,
        MESSAGE: "Full name must be less than 150 characters",
        REQUIRED_MESSAGE: "Full name is required",
    },
    PHONE: {
        MAX_LENGTH: 15,
        MESSAGE: "Phone number must be at most 15 characters",
        PATTERN: /^0\d{9,14}$/,
        PATTERN_MESSAGE: "Phone number must start with 0 and contain only digits",
        REQUIRED_MESSAGE: "Phone number is required",
    },
    EMAIL: {
        MAX_LENGTH: 255,
        MESSAGE: "Email must be less than 255 characters",
        INVALID_MESSAGE: "Email must be valid",
    }
} as const;

export const signInResponseSchema = z.object({
    accessToken: z.string().min(10),
    refreshToken: z.string().min(10),
    user: userSchema,
});

export const signUpResponseSchema = z.null().optional();
export const logoutResponseSchema = z.null().optional();

export const signInSchema = z.object({
    username: z
        .string()
        .min(AUTH_VALIDATION.USERNAME.MIN_LENGTH, "Username is required") // backend says NotBlank and Size(6,50). Frontend can enforce min 6.
        .max(AUTH_VALIDATION.USERNAME.MAX_LENGTH, "Username must be less than 50 characters"),
    password: z
        .string()
        .min(1, "Password is required"),
});

export const signUpSchema = z.object({
    username: z
        .string()
        .min(AUTH_VALIDATION.USERNAME.MIN_LENGTH, AUTH_VALIDATION.USERNAME.MESSAGE)
        .max(AUTH_VALIDATION.USERNAME.MAX_LENGTH, AUTH_VALIDATION.USERNAME.MESSAGE),
    email: z.string().email(AUTH_VALIDATION.EMAIL.INVALID_MESSAGE).max(AUTH_VALIDATION.EMAIL.MAX_LENGTH, AUTH_VALIDATION.EMAIL.MESSAGE).optional().or(z.literal('')),
    fullName: z
        .string()
        .min(1, AUTH_VALIDATION.FULL_NAME.REQUIRED_MESSAGE)
        .max(AUTH_VALIDATION.FULL_NAME.MAX_LENGTH, AUTH_VALIDATION.FULL_NAME.MESSAGE),
    phone: z
        .string()
        .min(1, AUTH_VALIDATION.PHONE.REQUIRED_MESSAGE)
        .max(AUTH_VALIDATION.PHONE.MAX_LENGTH, AUTH_VALIDATION.PHONE.MESSAGE)
        .regex(AUTH_VALIDATION.PHONE.PATTERN, AUTH_VALIDATION.PHONE.PATTERN_MESSAGE),
    password: z
        .string()
        .min(1, "Password is required")
        .regex(AUTH_VALIDATION.PASSWORD.PATTERN, AUTH_VALIDATION.PASSWORD.PATTERN_MESSAGE),
});

export const updateProfileSchema = z.object({
    fullName: z
        .string()
        .min(1, AUTH_VALIDATION.FULL_NAME.REQUIRED_MESSAGE)
        .max(AUTH_VALIDATION.FULL_NAME.MAX_LENGTH, AUTH_VALIDATION.FULL_NAME.MESSAGE),
});


export const forgotPasswordSchema = z.object({
    username: z
        .string()
        .min(AUTH_VALIDATION.USERNAME.MIN_LENGTH, AUTH_VALIDATION.USERNAME.MESSAGE),
});

export const updatePasswordSchema = z
    .object({
        oldPassword: z.string().min(1, "Old password is required"),
        newPassword: z
            .string()
            .min(AUTH_VALIDATION.PASSWORD.MIN_LENGTH, "New password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Confirm password is required"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

export type SignInResponse = z.infer<typeof signInResponseSchema>;
export type SignUpResponse = z.infer<typeof signUpResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
