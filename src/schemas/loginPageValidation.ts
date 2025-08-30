import z from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .max(50, { message: "Username must be at most 50 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be at most 100 characters" }),
});

// Infer the type from the schema
export type LoginFormInputs = z.infer<typeof loginSchema>;
