import { z } from "zod";

export const cardSchemas = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Card title is required")
    .max(120, "Card title should be less than 120 chars"),

  description: z
    .string()
    .trim()
    .max(1000, "Card description should be less than 1000 chars"),
  labels: z
    .array(z.string().trim().min(1))
    .refine(
      (labels) =>
        new Set(labels.map((label) => label.toLocaleLowerCase())).size ===
        labels.length,
      {
        message: "Labels should be uniques",
      },
    ),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assignee: z.string().trim().max(120),
  dueDate: z.string(),
  isArchived: z.boolean(),
});

export type CardFormValue = z.infer<typeof cardSchemas>