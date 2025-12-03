import z from "zod";

export const categoryStatusEnum = ["ACTIVE", "INACTIVE"] as const;

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(categoryStatusEnum),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryStatus = typeof categoryStatusEnum[number];

export const categoriesResponseSchema = z.object({
  contents: z.array(categorySchema),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  status: z.enum(categoryStatusEnum).optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  status: z.enum(categoryStatusEnum),
});

export const updateCategoryStatusSchema = z.object({
  status: z.string().min(2, "Status is required"),
});

export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type UpdateCategoryStatusInput = z.infer<typeof updateCategoryStatusSchema>;
