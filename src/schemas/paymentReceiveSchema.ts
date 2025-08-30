import { z } from "zod";

export const paymentReceiveSchema = z.object({
  amount: z.number().positive("Amount must be bigger than 0"),
  currency: z.number().int().positive("Currency is required"),
  party_type: z.enum(["employees", "members", "customers", "vendors"], {
    required_error: "Category is required",
  }),
  party_id: z.number().int().positive("Party Name is required"),
  cash_drawer_id: z.number(),
  transaction_type: z.enum(["pay", "receive"], {
    required_error: "Type is required",
  }),
  description: z.string().optional(),
});

export type PaymentReceiveFormData = z.infer<typeof paymentReceiveSchema>;