import z from "zod";

export const sizeStatusEnum = ["ACTIVE", "INACTIVE"] as const;

export const sizeSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    status: z.enum(sizeStatusEnum),
    createdAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
});

export type Size = z.infer<typeof sizeSchema>;
export type SizeStatus = typeof sizeStatusEnum[number];
