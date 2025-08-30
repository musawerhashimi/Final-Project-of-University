import { z } from "zod";

export const statementFormSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^\d+$/, "Amount must be a number"),
  type: z.enum(["Cash", "Loan"], {
    errorMap: () => ({ message: "Type is required" }),
  }),
  description: z.string().optional(),
  opening: z.enum(["Yes", "No"], {
    errorMap: () => ({ message: "Opening is required" }),
  }),
});

export type StatementFormData = z.infer<typeof statementFormSchema>;
