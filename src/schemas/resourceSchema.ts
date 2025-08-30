import z from "zod";

export const resourceSchema = z.object({
  name: z.string().min(1, "Currency name is required"),
  description: z.string().optional(),
  store: z.number({message: "Store is Required"}),
});

export type ResourceFormData = z.infer<typeof resourceSchema>;
