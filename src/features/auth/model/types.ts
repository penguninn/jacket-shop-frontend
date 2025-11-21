import z from "zod";
import { signInSchema, signUpSchema, updateProfileSchema } from "./schemas";

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
