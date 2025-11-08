import { z } from "zod";

export const ProblemSchema = z.object({
  type: z.string().url().optional(),
  title: z.string().optional(),
  status: z.number().optional(),
  detail: z.string().optional(),
  instance: z.string().optional(),
  errors: z.record(z.string(), z.string()).optional(),
});

export const apiResponse = <T extends z.ZodTypeAny>(inner: T) =>
  z.object({
    code: z.number(),
    message: z.string(),
    data: inner,
    timestamp: z.string(),
  });
