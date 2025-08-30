import z from "zod";

// Zod schema for form validation
export const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^\d+$/, "Phone must contain only digits"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

// Type for form data based on schema
export type EmployeeFormData = z.infer<typeof employeeSchema>;
