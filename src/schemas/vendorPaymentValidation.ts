import z from "zod";

export const transactionSchema = z.object({
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .min(0.01, "Amount must be greater than 0"),
  currency: z
    .number({
      invalid_type_error: "Currency is required",
    })
    .int()
    .positive("Currency is required"),

  cash_drawer: z.number({
    invalid_type_error: "Resource is required",
  }),

  type: z.enum(["pay", "receive"], {
    required_error: "Transaction type is required",
    invalid_type_error: "Invalid transaction type",
  }),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

// Define the TypeScript type for your form data based on the Zod schema
export type TransactionFormData = z.infer<typeof transactionSchema>;
