import z from "zod";

export const paymentSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Amount must be a positive number"
    ),
  currency: z.number().min(1, "Currency is required"),
  cash_drawer: z.number().min(1, "Resource is required"),
  expense_category: z.number().min(0, "Expense category is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long"),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
