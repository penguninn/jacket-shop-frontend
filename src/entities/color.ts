import z from "zod";

export const colorStatusEnum = ["ACTIVE", "INACTIVE"] as const;

export const colorSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    status: z.enum(colorStatusEnum),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
});

export type Color = z.infer<typeof colorSchema>;
export type ColorStatus = typeof colorStatusEnum[number];
