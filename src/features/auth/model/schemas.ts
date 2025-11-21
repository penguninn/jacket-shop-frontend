import z from "zod";
import { userSchema } from "@/entities/user";

export const logoutResSchema = z.null().optional();
export const signUpResSchema = z.null().optional();
export const signInResSchema = z.object({
    accessToken: z.string().min(10),
    refreshToken: z.string().min(10),
    user: userSchema
});

export const signInSchema = z.object({
    username: z
        .string()
        .min(6, "Min 6 characters"),
    password: z.string().min(6, "Min 6 characters"),
});

export const updateProfileSchema = z.object({
    fullName: z.string().min(6, "Min 6 characters"),
});

export const signUpSchema = z.object({
    username: z.string().min(6, "Min 6 characters"),
    fullName: z.string().min(6, "Min 6 characters"),
    phoneNumber: z.string().min(10, "Min 10 characters"),
    password: z.string().min(6, "Min 6 characters"),
});
