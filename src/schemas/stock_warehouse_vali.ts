import { z } from "zod";

export const stockWarehouseSchema = z.object({
  name: z.string().min(2, "Name is required"),
  location_type: z.enum(["store", "warehouse"], { required_error: "Type is required" }),
  address: z.string().min(2, "Address is required"),
});

export type StockWarehouseData = z.infer<typeof stockWarehouseSchema>;