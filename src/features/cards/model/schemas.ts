import { z } from "zod";
import { Priority } from "@/src/shared/types/normalized";

export interface CardFormValue {
  title: string;
  description: string;
  labels: string[];
  priority: Priority;
  assignee: string;
  dueDate: string;
  isArchived: boolean;
}

export const cardSchemas: z.ZodType<CardFormValue> = z.object({
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
