import z from "zod";

export const currencySchema = z.object({
  name: z.string().min(1, "Currency name is required"),
  code: z.string().min(1, "Code is required").max(5),
  symbol: z.string().min(1, "Symbol is required").max(5),
  exchange_rate: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Exchange rate must be a number",
  }),
});

export type CurrencyFormData = z.infer<typeof currencySchema>;
