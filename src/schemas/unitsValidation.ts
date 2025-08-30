import z from "zod";

// Define the Zod schema for unit validation
export const unitSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Unit name must be at least 2 characters long." }),
  symbol: z
    .string()
    .min(1, { message: "Unit symbol is required." })
    .max(10, { message: "Symbol cannot exceed 10 characters." }),
});

// Define types for the unit
export type UnitType = z.infer<typeof unitSchema> & {
  id: string; // Add an ID for unique keying in lists
};
