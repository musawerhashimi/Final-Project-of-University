// hooks/useCartValidation.ts

import { useCallback, useState } from "react";
import { z } from "zod";
import { fieldSchemas } from "../schemas/cartValidation";
import type { CartItemData } from "../entities/CartItemData";

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const useCartValidation = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateField = useCallback(
    (
      fieldName: keyof typeof fieldSchemas,
      value: string | number
    ): { isValid: boolean; error?: string } => {
      try {
        const schema = fieldSchemas[fieldName];
        schema.parse(value);

        // Clear error if validation passes
        setFieldErrors((prev) => {
          const { [fieldName]: _, ...rest } = prev;
          return rest;
        });

        return { isValid: true };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessage = error.errors[0]?.message || "Invalid value";

          // Set error for this field
          setFieldErrors((prev) => ({
            ...prev,
            [fieldName]: errorMessage,
          }));

          return { isValid: false, error: errorMessage };
        }
        return { isValid: false, error: "Validation failed" };
      }
    },
    []
  );

  const validateCartItem = useCallback(
    (item: CartItemData): ValidationResult => {
      const errors: ValidationError[] = [];

      // Validate sell price
      const sellPriceResult = validateField("selling_price", item.selling_price);
      if (!sellPriceResult.isValid && sellPriceResult.error) {
        errors.push({ field: "selling_price", message: sellPriceResult.error });
      }

      // Validate quantity
      const quantityResult = validateField("quantity", item.quantity);
      if (!quantityResult.isValid && quantityResult.error) {
        errors.push({ field: "quantity", message: quantityResult.error });
      }

      // Validate discount percent
      const discountResult = validateField(
        "discountPercent",
        item.discountPercent
      );
      if (!discountResult.isValid && discountResult.error) {
        errors.push({
          field: "discountPercent",
          message: discountResult.error,
        });
      }

      // Validate notes
      const notesResult = validateField("notes", item.notes);
      if (!notesResult.isValid && notesResult.error) {
        errors.push({ field: "notes", message: notesResult.error });
      }

      // Validate discount price
      const discountPriceResult = validateField(
        "discountPrice",
        item.discountPrice
      );
      if (!discountPriceResult.isValid && discountPriceResult.error) {
        errors.push({
          field: "discountPrice",
          message: discountPriceResult.error,
        });
      }

      // Validate price per quantity
      const quantityPriceResult = validateField(
        "quantityPrice",
        item.quantityPrice
      );
      if (!quantityPriceResult.isValid && quantityPriceResult.error) {
        errors.push({ field: "quantityPrice", message: quantityPriceResult.error });
      }

      // Custom business logic validations
      if (item.quantity > item.available) {
        errors.push({
          field: "quantity",
          message: `Quantity cannot exceed available stock (${item.available})`,
        });
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    },
    [validateField]
  );

  const clearFieldError = useCallback((fieldName: string) => {
    setFieldErrors((prev) => {
      const { [fieldName]: _, ...rest } = prev;

      return rest;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const getFieldError = useCallback(
    (fieldName: string): string | undefined => {
      return fieldErrors[fieldName];
    },
    [fieldErrors]
  );

  const hasErrors = Object.keys(fieldErrors).length > 0;

  return {
    validateField,
    validateCartItem,
    clearFieldError,
    clearAllErrors,
    getFieldError,
    fieldErrors,
    hasErrors,
  };
};
