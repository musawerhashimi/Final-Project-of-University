import z from "zod";

export const unitSchema = z.object({
  name: z.string().min(1, "Unit name is required"),
  abbreviation: z
    .string()
    .min(1, "Abbreviation is required")
    .max(10, "Unit Abbreviation cannot be more than 10 characters"),
});

export type UnitFormData = z.infer<typeof unitSchema>;
