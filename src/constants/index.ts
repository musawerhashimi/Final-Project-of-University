// constants/index.ts

export const ANIMATION = {
  EXPANSION_HEIGHT: 450,
  TRANSITION_DURATION: 300,
  HOVER_DURATION: 200,
} as const;

export const VALIDATION = {
  MIN_PRICE: 0,
  MAX_PRICE: 999999,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 999999,
  MIN_DISCOUNT_PERCENT: 0,
  MAX_DISCOUNT_PERCENT: 100,
  MAX_NOTES_LENGTH: 500,
} as const;

export const UI = {
  DECIMAL_STEP_BASE: 10,
  DEFAULT_CURRENCY_ID: 1,
  DROPDOWN_WIDTH: 20,
} as const;

export const MESSAGES = {
  VALIDATION: {
    PRICE_REQUIRED: "Price is required",
    PRICE_MIN: "Price must be greater than 0",
    PRICE_MAX: "Price cannot exceed 999,999",
    QUANTITY_REQUIRED: "Quantity is required",
    QUANTITY_MIN: "Quantity must be at least 1",
    QUANTITY_MAX: "Quantity cannot exceed 999,999",
    DISCOUNT_PERCENT_MIN: "Discount cannot be negative",
    DISCOUNT_PERCENT_MAX: "Discount cannot exceed 100%",
    NOTES_MAX: "Notes cannot exceed 500 characters",
    CURRENCY_INVALID: "Invalid currency selected",
  },
  CART: {
    EMPTY: "Your cart is empty.",
    DELETE_CONFIRM: "Are you sure you want to delete this item?",
  },
} as const;

export const FORM = {
  DEBOUNCE_MS: 300,
} as const;
