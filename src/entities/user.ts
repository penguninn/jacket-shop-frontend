import z from "zod";

export const userStatusEnum = ["ACTIVE", "INACTIVE"] as const;

export const userSchema = z.object({
    id: z.number(),
    username: z.string(),
    fullName: z.string(),
    phone: z.string().nullable(),
    status: z.enum(userStatusEnum),
    roles: z.array(z.string()),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;
export type UserStatus = typeof userStatusEnum[number];
