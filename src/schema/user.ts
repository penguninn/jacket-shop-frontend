import z from "zod";

export const profileResSchema = z.object({
  id: z.number(),
  username: z.string(),
  fullName: z.string(),
  phone: z.string(),
  roles: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(6, "Min 6 characters"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
