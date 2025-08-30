// stores/useCartStore.ts
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import type { CartItemData } from "../entities/CartItemData";
import type { InventoryItem } from "../entities/InventoryItem";
import type { Price } from "../entities/Price";
import type { Receipt } from "../entities/Receipt";
import type { SaleCustomer } from "../entities/SaleCustomer";
import type { SalePaymentData } from "../entities/SalePayment";
import apiClient from "../lib/api";
import { productToCart } from "../utils/productToCart";
import { roundWithPrecision } from "../utils/roundWithPrecision";
import {
  convertCurrency,
  getBaseCurrency,
  useCurrencyStore,
} from "./useCurrencyStore";

interface CartState {
  id: number;
  items: CartItemData[];
  payments: SalePaymentData[];
  sale_date?: Date | null;
  discount_amount: number;
  added_to_acount: number;
  customer?: SaleCustomer;
  notes: string;
  subtotalCurrencyId: number;
  isOpen: boolean;
}

interface CartActions {
  // Cart management
  addItem: (product: InventoryItem) => void;
  updateItem: (updated: CartItemData) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  setItems: (items: CartItemData[]) => void;

  // Currency management
  setSubtotalCurrency: (currencyId: number) => void;

  // sales
  addPayment: (payment: Omit<SalePaymentData, "id">) => void;
  clearPayments: () => void;
  deletePayment: (id: number) => void;
  setSaleDate: (date: Date | null | string) => void;
  setNotes: (note: string) => void;
  // UI state
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;

  // Computed values
  getSubtotal: () => number;
  getTotalAmount: () => number;
  getItemCount: () => number;
  getItemById: (id: number) => CartItemData | undefined;
  getItemTotalAmount: (itemId: number) => number;
  setDiscountPrice: (discount_amount: number) => void;
  getFinalAmount: () => number;

  // Customer
  setCustomer: (customer?: SaleCustomer) => void;
  getCustomers: (keyword: string) => Promise<SaleCustomer[]>;
  addToCustomerAccount: (amount: number) => void;
  clearCustomerAccount: () => void;

  submitSale: () => Promise<Receipt>;
  clearStore: () => void;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      id: new Date().getTime(), // Unique ID based on timestamp
      items: [],
      subtotalCurrencyId: 0,
      isOpen: true,
      payments: [],
      sale_date: null,
      discount_amount: 0,
      notes: "",
      added_to_acount: 0,
      getCurrencyStore: useCurrencyStore,
      // Actions
      addItem: (newItem) => {
        const { items } = get();

        const existingItemIndex = items.findIndex(
          (item) => item.id === newItem.id
        );

        if (existingItemIndex > -1) {
          // Item exists, increment quantity by 1
          const existingItem = items[existingItemIndex];
          const newQuantity = existingItem.quantity + 1;

          // Check if new quantity exceeds available stock
          if (newQuantity > existingItem.available) {
            console.warn(
              `Cannot add more items. Available stock: ${existingItem.available}`
            );
            return;
          }

          // Calculate updated item with new quantity using the shared function
          const updatedItem = calculateItemUpdate(
            existingItem,
            "quantity",
            newQuantity,
            convertCurrency
          );

          set(
            (state) => ({
              items: state.items.map((item) =>
                item.id === updatedItem.id ? updatedItem : item
              ),
            }),
            false,
            "addItem/increment"
          );
        } else {
          // New item, convert product to cart item
          const newCartItem = productToCart(newItem);
          set(
            (state) => ({
              items: [...state.items, newCartItem],
            }),
            false,
            "addItem/new"
          );
        }
      },

      updateItem: (updated: CartItemData) => {
        set(
          (state) => ({
            items: state.items.map((item) =>
              item.id === updated.id ? updated : item
            ),
          }),
          false,
          "updateItem"
        );
      },

      removeItem: (id: number) => {
        set(
          (state) => ({
            items: state.items.filter((item) => item.id !== id),
          }),
          false,
          "removeItem"
        );
      },

      clearCart: () => {
        set({ items: [] }, false, "clearCart");
      },

      setItems: (items: CartItemData[]) => {
        set({ items }, false, "setItems");
      },

      setSubtotalCurrency: (currencyId: number) => {
        set({ subtotalCurrencyId: currencyId }, false, "setSubtotalCurrency");
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }), false, "toggleCart");
      },

      setCartOpen: (isOpen: boolean) => {
        set({ isOpen }, false, "setCartOpen");
      },

      getSubtotal: () => {
        const { items, getItemTotalAmount } = get();
        return items.reduce((sum, item) => {
          const itemTotal = getItemTotalAmount(item.id);
          return sum + itemTotal;
        }, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      getItemById: (id: number) => {
        const { items } = get();
        return items.find((item) => item.id === id);
      },

      getItemTotalAmount: (itemId: number) => {
        const { subtotalCurrencyId, getItemById } = get();
        const item = getItemById(itemId);
        if (!item) return 0;
        // Convert quantityPrice to subtotal currency
        const quantityPriceInSubtotalCurrency = convertCurrency(
          item.quantityPrice,
          item.quantityCurrency,
          subtotalCurrencyId
        );

        // Convert discountPrice to subtotal currency
        const discountPriceInSubtotalCurrency = convertCurrency(
          item.discountPrice,
          item.discountCurrency,
          subtotalCurrencyId
        );

        // Calculate final amount: quantityPrice - discountPrice
        return Math.max(
          0,
          quantityPriceInSubtotalCurrency - discountPriceInSubtotalCurrency
        );
      },

      addPayment(payment) {
        const { payments, getFinalAmount, subtotalCurrencyId } = get();

        const finalAmount = getFinalAmount();
        if (finalAmount <= 0) {
          return;
        }
        const pay = convertCurrency(
          payment.amount,
          payment.currency,
          subtotalCurrencyId
        );
        if (pay > finalAmount) {
          payment.amount = convertCurrency(
            finalAmount,
            subtotalCurrencyId,
            payment.currency
          );
        }
        const id = payments.length;

        set(() => ({ payments: [...payments, { ...payment, id }] }));
      },
      deletePayment(id) {
        set((state) => ({
          payments: state.payments.filter((p) => p.id !== id),
        }));
      },
      setNotes(note) {
        set(() => ({ notes: note }));
      },
      setSaleDate(date) {
        let d: Date | null;

        if (typeof date == "string") {
          d = date.trim() === "" ? null : new Date(date);
        } else {
          d = date;
        }
        set(() => ({ sale_date: d }));
      },
      setDiscountPrice(discount) {
        if (discount < 0) {
          return;
        }
        const { getSubtotal } = get();
        set(() => ({ discount_amount: getSubtotal() - discount }));
      },

      getTotalAmount() {
        const { getSubtotal, discount_amount } = get();
        return roundWithPrecision(getSubtotal() - discount_amount, 2);
      },

      getFinalAmount() {
        const { payments, getTotalAmount, subtotalCurrencyId, customer } =
          get();
        const total_amount = getTotalAmount();
        return (
          total_amount -
          convertCurrency(
            customer?.added_to_account || 0,
            getBaseCurrency().id,
            subtotalCurrencyId
          ) -
          payments.reduce(
            (prev, payment) =>
              prev +
              convertCurrency(
                payment.amount,
                payment.currency,
                subtotalCurrencyId
              ),
            0
          )
        );
      },
      setCustomer(customer) {
        set(() => ({ customer }));
      },
      async getCustomers(keyword) {
        if (!keyword) {
          return [];
        }

        const customers = (
          await apiClient.get<SaleCustomer[]>(
            "/customers/customers/sales-search?q=" + keyword
          )
        ).data;
        return customers;
      },
      addToCustomerAccount(amount) {
        const { customer, subtotalCurrencyId } = get();
        if (!customer) {
          return;
        }
        if (amount <= 0) {
          return;
        }
        const baseCurrency = getBaseCurrency();
        const new_amount = convertCurrency(
          amount,
          subtotalCurrencyId,
          baseCurrency.id
        );
        set(() => ({
          customer: {
            ...customer,
            added_to_account: (customer.added_to_account || 0) + new_amount,
          },
        }));
      },
      clearCustomerAccount() {
        const { customer } = get();
        if (!customer) {
          return;
        }
        set(() => ({ customer: { ...customer, added_to_account: undefined } }));
      },
      clearPayments() {
        set(() => ({ payments: [] }));
      },
      submitSale: async () => {
        const {
          items,
          payments,
          customer,
          notes,
          sale_date,
          discount_amount,
          subtotalCurrencyId,
          id: receipt_id,
        } = get();

        // Build payload to match DRF serializer
        const payload = {
          receipt_id: receipt_id.toString(),
          sale_date: sale_date
            ? sale_date.toISOString()
            : new Date().toISOString(),
          customer: customer?.id ?? null,
          discount_amount,
          tax_amount: 0, // adjust if you add tax logic later
          currency: subtotalCurrencyId,
          notes,
          items: items.map((it) => ({
            inventory: it.inventory,
            quantity: it.quantity,
            unit_price: convertCurrency(
              it.selling_price,
              it.selling_currency,
              subtotalCurrencyId
            ),
            discount_amount: convertCurrency(
              it.discountPrice,
              it.discountCurrency,
              subtotalCurrencyId
            ),
          })),
          payments: payments,
        };

        // POST to /api/sales/sales/
        const response = await apiClient.post("/sales/sales/", payload);

        return response.data;
      },
      clearStore() {
        const {
          clearCart,
          setSubtotalCurrency,
          setDiscountPrice,
          clearCustomerAccount,
          setCustomer,
          clearPayments,
        } = get();
        // reset store back to defaults
        clearCart();
        setSubtotalCurrency(0);
        setDiscountPrice(0);
        clearCustomerAccount();
        setCustomer(undefined);
        clearPayments();
        // bump receipt id so next sale is unique
        set({ id: new Date().getTime() }, false, "submitSale/newReceiptId");
      },
    })),

    {
      name: "cart-store", // name for devtools
    }
  )
);

// Core calculation function with correct relationships
export const calculateItemUpdate = (
  item: CartItemData,
  field: string,
  value: number | string,
  convertCurrency: (
    price: number,
    fromCurrencyId: number,
    toCurrencyId: number
  ) => number
): CartItemData => {
  // Helper to convert any price to sellPrice currency
  const toSellCurrency = (price: Price) =>
    convertCurrency(price.price, price.currencyId, item.selling_currency);

  // Start with current values
  let selling_price = item.selling_price;
  let quantityPrice = item.quantityPrice;
  let discountPrice = item.discountPrice;
  let discountPercent = item.discountPercent;
  let quantity = item.quantity;
  let notes = item.notes;

  // Update the changed field first
  switch (field) {
    case "selling_price":
      selling_price = value as number;
      break;
    case "quantityPrice":
      quantityPrice = value as number;
      break;
    case "discountPrice":
      discountPrice = value as number;
      break;
    case "discountPercent":
      discountPercent = value as number;
      break;
    case "quantity":
      quantity = value as number;
      break;
    case "notes":
      notes = value as string;
      return { ...item, notes }; // Early return for notes
  }

  // Apply correct relationships based on what changed
  if (field === "selling_price") {
    // sellPrice changed -> update quantityPrice
    quantityPrice = convertCurrency(
      selling_price * quantity,
      item.selling_currency,
      item.quantityCurrency
    );
  } else if (field === "quantityPrice") {
    // quantityPrice changed -> update quantity (if sellPrice is not 0)
    if (selling_price !== 0) {
      const sellPriceInQuantityCurrency = convertCurrency(
        item.selling_price,
        item.selling_currency,
        item.quantityCurrency
      );
      quantity = roundWithPrecision(
        quantityPrice / sellPriceInQuantityCurrency,
        2
      );
    }
  } else if (field === "quantity") {
    // quantity changed -> update quantityPrice
    quantityPrice = convertCurrency(
      selling_price * quantity,
      item.selling_currency,
      item.quantityCurrency
    );
  } else if (field === "discountPrice") {
    // discountPrice changed -> update discountPercent
    const quantityPriceInSellCurrency = toSellCurrency({
      price: quantityPrice,
      currencyId: item.quantityCurrency,
    });
    const discountPriceInSellCurrency = toSellCurrency({
      price: discountPrice,
      currencyId: item.discountCurrency,
    });
    discountPercent =
      quantityPriceInSellCurrency > 0
        ? (discountPriceInSellCurrency / quantityPriceInSellCurrency) * 100
        : 0;
  } else if (field === "discountPercent") {
    // discountPercent changed -> update discountPrice
    const quantityPriceInSellCurrency = toSellCurrency({
      price: quantityPrice,
      currencyId: item.quantityCurrency,
    });
    const discountAmountInSellCurrency =
      (quantityPriceInSellCurrency * discountPercent) / 100;
    discountPrice = convertCurrency(
      discountAmountInSellCurrency,
      item.selling_currency,
      item.discountCurrency
    );
  }

  return {
    ...item,
    quantity,
    discountPercent,
    notes,
    selling_price: selling_price,
    quantityPrice: quantityPrice,
    discountPrice: discountPrice,
  };
};
