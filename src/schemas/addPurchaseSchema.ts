import { z } from 'zod';

// ===== ZOD SCHEMAS =====

// Variant Schema (for API)
export const addVariantSchema = z.object({
  variant_name: z.string().min(1, 'Variant name is required'),
  is_default: z.boolean(),
  image: z.string(),
  barcode: z.string().min(1, 'Barcode is required'),
  cost_price: z.number().min(0, 'Cost price must be positive'),
  cost_currency_id: z.number().min(1, 'Cost currency is required'),
  selling_price: z.number().min(0, 'Selling price must be positive'),
  selling_currency_id: z.number().min(1, 'Selling currency is required'),
});

// Product Schema (for API)
export const addProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  category_id: z.number().min(1, 'Category is required'),
  base_unit_id: z.number().min(1, 'Base unit is required'),
  description: z.string().optional(),
  reorder_level: z.number().min(0, 'Reorder level must be positive'),
  variants: z.array(addVariantSchema).min(1, 'At least one variant is required'),
});

// Purchase Item Schema
export const addPurchaseItemSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  barcode: z.string().min(1, 'Barcode is required'),
  departmentId: z.number().min(1, 'Department is required'),
  categoryId: z.number().min(1, 'Category is required'),
  unitId: z.number().min(1, "Unit is required!"),
  costPrice: z.number().min(0.001, 'Cost price must be bigger than zero'),
  costCurrencyId: z.number().min(1, 'Cost currency is required'),
  sellingPrice: z.number().min(0.001, 'Selling price must be bigger than zero'),
  sellingCurrencyId: z.number().min(1, 'Selling currency is required'),
  quantity: z.number().min(1, 'Quantity must be positive'),
  
  image: z.instanceof(File).optional(),
  reorderLevel: z.number().min(0, 'Reorder level must be positive'),
  notes: z.string().optional(),
  expireDate: z.string().optional().refine(val => !(val && isNaN(Date.parse(val))), "Invalid Date Format").optional(),
});

// Purchase Schema
export const addPurchaseSchema = z.object({
  vendor: z.number().min(1, 'Vendor is required'),
  location: z.number().min(1, 'Location is required'),
  currency: z.number().min(1, 'Currency is required'),
  notes: z.string().optional(),
  items: z.array(addPurchaseItemSchema).min(1, 'At least one item is required'),
});

// ===== TYPES =====

export type AddVariantData = z.infer<typeof addVariantSchema>;
export type AddProductData = z.infer<typeof addProductSchema>;
export type AddPurchaseItemSchemaData = z.infer<typeof addPurchaseItemSchema>;
export type AddPurchaseData = z.infer<typeof addPurchaseSchema>;