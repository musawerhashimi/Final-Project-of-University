import { useCallback } from "react";
import type { CartItemData } from "../entities/CartItemData";
import { useCartValidation } from "../hooks/useCartValidation";
import { calculateItemUpdate } from "../stores/useCartStore"; // Import shared function
import type { fieldSchemas } from "../schemas/cartValidation";
import { useCurrencyStore } from "../stores";

export interface CartItemFormProps {
  item: CartItemData;
  onUpdate: (updated: CartItemData) => void;
}

export function useCartItemForm({ item, onUpdate }: CartItemFormProps) {
  const { validateField, getFieldError } = useCartValidation();
  const convertCurrency = useCurrencyStore(s => s.convertCurrency)

  // Generic update handler using the shared calculation function
  const updateField = useCallback(
    (field: keyof typeof fieldSchemas, value: number | string) => {
      // Validate first
      const validation = validateField(field, value);
      if (!validation.isValid) return;
      
      // Calculate and update using shared function
      const updatedItem = calculateItemUpdate(item, field, value, convertCurrency);
      
      onUpdate(updatedItem);
    },
    [convertCurrency, item, onUpdate, validateField]
  );

  // Specific handlers that parse input and call updateField
  const handlePriceChange = useCallback(
    (
      value: string,
      priceField: "selling_price" | "discountPrice" | "quantityPrice"
    ) => {
      const numericValue =
      value === "" ? item[priceField] : parseFloat(value);
      if (isNaN(numericValue)) return;
      updateField(priceField, numericValue);
    },
    [item, updateField]
  );

  const handleQuantityChange = useCallback(
    (value: string) => {
      const numericValue = parseFloat(value) || 0;
      if (numericValue < 0) return;
      updateField("quantity", numericValue);
    },
    [updateField]
  );

  const handleDiscountPercentChange = useCallback(
    (value: string) => {
      const numericValue =
        value === "" ? item.discountPercent : parseFloat(value);
      if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) return;
      updateField("discountPercent", numericValue);
    },
    [item.discountPercent, updateField]
  );

  const handleCurrencyChange = useCallback(
    (
      newCurrencyId: number,
      priceField: "selling_price" | "discountPrice" | "quantityPrice",
      price_currency: "selling_currency" | "discountCurrency" | "quantityCurrency"
    ) => {
      // Only convert the specific field's currency, no other calculations
      const convertedPrice = convertCurrency(item[priceField], item[price_currency], newCurrencyId);
      const updatedItem = {
        ...item,
        [priceField]: convertedPrice,
        [price_currency]: newCurrencyId
      };
      onUpdate(updatedItem);
    },
    [convertCurrency, item, onUpdate]
  );

  const handleNotesChange = useCallback(
    (value: string) => {
      updateField("notes", value);
    },
    [updateField]
  );

  // Convenience alias for discount price
  const handleDiscountPriceChange = useCallback(
    (value: string) => handlePriceChange(value, "discountPrice"),
    [handlePriceChange]
  );

  return {
    handlePriceChange,
    handleCurrencyChange,
    handleQuantityChange,
    handleDiscountPercentChange,
    handleDiscountPriceChange,
    handleNotesChange,
    getFieldError,
  };
}