import z from "zod";

export const logoutResSchema = z.null().optional();
export const signUpResSchema = z.null().optional();
export const signInResSchema = z.object({
  accessToken: z.string().min(10),
  refreshToken: z.string().min(10),
  user: z.object({
    id: z.number(),
    fullName: z.string(),
    roles: z.array(z.string()),
  }),
});

export const signInSchema = z.object({
  username: z
    .string()
    .min(6, "Min 6 characters"),
  password: z.string().min(6, "Min 6 characters"),
});
export const signUpSchema = z.object({
  username: z.string().min(6, "Min 6 characters"),
  fullName: z.string().min(6, "Min 6 characters"),
  phoneNumber: z.string().min(10, "Min 10 characters"),
  password: z.string().min(6, "Min 6 characters"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
