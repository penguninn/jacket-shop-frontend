import { z } from "zod";

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    code: z.number(),
    message: z.string(),
    data: dataSchema,
    timestamp: z.string(),
  }).transform((res: any) => res.data);

export const emptyApiResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  timestamp: z.string(),
}).transform(() => undefined);

export const pageResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    contents: z.array(itemSchema),
    page: z.number(),
    size: z.number(),
    totalPages: z.number(),
    totalElements: z.number(),
  });

export type PageResponse<T> = {
  contents: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

export const statusEnum = ["ACTIVE", "INACTIVE"] as const;
export const statusSchema = z.enum(statusEnum);
export type Status = z.infer<typeof statusSchema>;

export type SortDirection = "ASC" | "DESC";
export interface BaseFilterParams {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: SortDirection;
  search?: string;
  status?: Status[];
}
