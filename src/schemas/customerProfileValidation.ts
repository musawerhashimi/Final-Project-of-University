import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  city: z.string().min(1, "City is required"),
  birth: z.string().optional(),
  gender: z.enum(["male", "female"]),
});
