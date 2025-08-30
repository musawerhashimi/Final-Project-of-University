import z from "zod";

// Zod schema for form validation

// Validation schema
export const monthlyPaymentSchema = z.object({
  name: z.string().min(1, "Payment name is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  currency: z.number().min(1, "Currency is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  reference_type: z.enum(["employee", "expense_category"]),
  reference_id: z.number().min(1, "Reference is required"),
  description: z.string().optional(),
});


export type MonthlyPaymentFormData = z.infer<typeof monthlyPaymentSchema>;
