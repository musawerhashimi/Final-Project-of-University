import { z } from "zod";

export const paymentFormSchema = z
  .object({
    paymentMethod: z.enum(["cash", "loan", "free"]),
    paymentSource: z.number({invalid_type_error: "Payment Source is Required"}).int().optional().nullable(), // only required when method is cash
    paymentCurrency: z.number({invalid_type_error: "Payment Currency is Required"}).int().optional().nullable(), // only when method is cash
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "cash") {
      if (!data.paymentSource) {
        ctx.addIssue({
          path: ["paymentSource"],
          message: "Payment source is required when using cash.",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.paymentCurrency) {
        ctx.addIssue({
          path: ["paymentCurrency"],
          message: "Payment currency is required when using cash.",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export type PaymentFormData = z.infer<typeof paymentFormSchema>;
