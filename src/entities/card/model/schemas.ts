import z from "zod";

export const cardSchemas = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Card title is required")
    .max(120, "Card title should be less than 120 chars"),

  description: z
    .string()
    .trim()
    .max(1000, "Card description should be less than 1000 chars")
    .optional(),
});

export type CardFormValue = z.infer<typeof cardSchemas>