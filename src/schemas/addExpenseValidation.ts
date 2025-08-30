import z from "zod";

export const expenseSchema = z.object({
  name: z.string().min(1, "Expense name is required").max(100, "Name too long"),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
