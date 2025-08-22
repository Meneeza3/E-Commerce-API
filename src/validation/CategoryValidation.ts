import { z } from "zod";

export const mainCategorySchema = z.object({
  name: z.string().min(2).max(50),
  sortOrder: z.number().min(0).optional(),
  metadata: z
    .object({
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    })
    .optional(),
  isActive: z.boolean(),
  createdBy: z.string(),
});
