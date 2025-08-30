import z from "zod";

// Zod schema for form validation
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255, "Name too long"),
  department: z.number().min(1, "Department is required"),
  category: z.number().min(1, "Category is required"),
  base_unit: z.number().min(1, "Unit is required"),
  reorder_level: z.number().min(0, "Reorder level must be positive"),
  description: z.string().max(1000, "Description too long").optional(),
  selling_price: z.string().min(1, "Selling price is required"),
  selling_currency: z.number().min(1, "Currency is required"),
});

export type ProductFormData = z.infer<typeof productSchema>;
