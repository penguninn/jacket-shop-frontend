import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().min(6, "Please enter a valid username, min 6 characters"),
  password: z.string().min(6, "Min 6 characters"),
});
export type SignInForm = z.infer<typeof signInSchema>;
