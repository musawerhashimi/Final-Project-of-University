// schemas/cartValidation.ts

import { z } from "zod";
import { VALIDATION, MESSAGES } from "../constants";

// Price schema
export const priceSchema = z.object({
  price: z
    .number({
      required_error: MESSAGES.VALIDATION.PRICE_REQUIRED,
      invalid_type_error: MESSAGES.VALIDATION.PRICE_REQUIRED,
    })
    .min(VALIDATION.MIN_PRICE, MESSAGES.VALIDATION.PRICE_MIN)
    .max(VALIDATION.MAX_PRICE, MESSAGES.VALIDATION.PRICE_MAX),
  currencyId: z
    .number()
});

// Cart item validation schema
export const cartItemSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Product name is required"),
  quantity: z
    .number({
      required_error: MESSAGES.VALIDATION.QUANTITY_REQUIRED,
      invalid_type_error: MESSAGES.VALIDATION.QUANTITY_REQUIRED,
    })
    .min(VALIDATION.MIN_QUANTITY, MESSAGES.VALIDATION.QUANTITY_MIN)
    .max(VALIDATION.MAX_QUANTITY, MESSAGES.VALIDATION.QUANTITY_MAX),
  unit: z.string().min(1, "Unit is required"),
  available: z.number().min(0, "Available quantity cannot be negative"),
  sellPrice: priceSchema,
  quantityPrice: priceSchema,
  discountPrice: priceSchema,
  discountPercent: z
    .number()
    .min(
      VALIDATION.MIN_DISCOUNT_PERCENT,
      MESSAGES.VALIDATION.DISCOUNT_PERCENT_MIN
    )
    .max(
      VALIDATION.MAX_DISCOUNT_PERCENT,
      MESSAGES.VALIDATION.DISCOUNT_PERCENT_MAX
    ),
  notes: z
    .string()
    .max(VALIDATION.MAX_NOTES_LENGTH, MESSAGES.VALIDATION.NOTES_MAX),
  realPrice: priceSchema,
});

// Partial schema for form updates
export const cartItemUpdateSchema = cartItemSchema.partial().extend({
  id: z.number(), // ID is always required
});

// Individual field schemas for real-time validation
export const fieldSchemas = {
  selling_price: priceSchema.shape.price,
  quantity: cartItemSchema.shape.quantity,
  discountPercent: cartItemSchema.shape.discountPercent,
  notes: cartItemSchema.shape.notes,
  discountPrice: priceSchema.shape.price,
  quantityPrice: priceSchema.shape.price,
} as const;

// Type exports
export type CartItemFormData = z.infer<typeof cartItemSchema>;
export type CartItemUpdateData = z.infer<typeof cartItemUpdateSchema>;
export type PriceData = z.infer<typeof priceSchema>;
