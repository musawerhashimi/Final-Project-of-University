import z from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  // Phone is optional, but if provided, it must match the regex
  phone: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Allow empty string (optional)
      // Basic phone number regex: allows optional '+' at start, 7 to 15 digits
      return /^\+?\d{7,15}$/.test(val);
    }, "Invalid phone number format (e.g., +1234567890 or 1234567890)"),
  photo: z.instanceof(File).optional(),
});

// Define the TypeScript type for your form data based on the Zod schema
export type ContactFormData = z.infer<typeof contactSchema>;
