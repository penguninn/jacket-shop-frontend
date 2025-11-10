import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string().min(6, "Min 6 characters"),
  fullName: z.string().min(6, "Min 6 characters"),
  phoneNumber: z.string().min(10, "Min 10 characters"),
  password: z.string().min(6, "Min 6 characters"),
});
export type SignUpForm = z.infer<typeof signUpSchema>;
