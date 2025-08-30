// stores/useAddPurchaseStore.ts
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import type {
  AddPurchaseData,
  AddPurchaseItemData,
} from "../entities/AddPurchaseData";
import { apiClient } from "../lib/api";
import { convertCurrency } from "./useCurrencyStore";
// import type { ProductData } from "../entities/ProductData";

interface CashPayment {
  cash_drawer: number;
  currency: number;
}
export type PaymentMethodType = "free" | "loan" | CashPayment;

interface AddPurchaseStore extends AddPurchaseData {
  // UI/Form states
  isSubmitting: boolean;
  submitError: string | null;
  paymentMethod: PaymentMethodType;
  // Editing state
  editingItemId: number | null;

  // Actions
  setVendor: (vendorId: number) => void;
  // setLocation: (locationId: number) => void;
  setCurrency: (currencyId: number) => void;
  setNotes: (notes: string) => void;
  setPaymentMethod: (method: PaymentMethodType) => void;
  // Item management
  addItem: (item: Omit<AddPurchaseItemData, "id">) => void;
  updateItem: (id: number, updatedItem: Partial<AddPurchaseItemData>) => void;
  removeItem: (id: number) => void;
  getItemById: (id: number) => AddPurchaseItemData | undefined;
  setItems: (items: AddPurchaseItemData[]) => void;
  clearItems: () => void;

  // Editing
  setEditingItem: (id: number | null) => void;
  isEditing: (id: number) => boolean;

  // Calculations
  getSubtotal: () => number;
  getItemCount: () => number;
  getItemTotalAmount: (itemId: number) => number;
  getTotalPurchaseAmount: () => number;

  // API actions
  submitPurchase: () => Promise<void>;

  // Reset
  resetStore: () => void;
}

// Generate unique ID for items
let itemIdCounter = 1;
const generateItemId = () => itemIdCounter++;

const initialState = {
  vendor: 1,
  currency: 1,
  notes: "",
  items: [],
  isSubmitting: false,
  submitError: null,
  editingItemId: null,
  paymentMethod: "loan" as const, // Default payment method
};

export const useAddPurchaseStore = create<AddPurchaseStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,
      // Basic setters
      setVendor: (vendorId: number) => {
        set({ vendor: vendorId }, false, "setVendor");
      },

      // setLocation: (locationId: number) => {
      //   set({ location: locationId }, false, "setLocation");
      // },

      setCurrency: (currencyId: number) => {
        set({ currency: currencyId }, false, "setCurrency");
      },

      setNotes: (notes: string) => {
        set({ notes }, false, "setNotes");
      },

      // Item management
      addItem: (item: Omit<AddPurchaseItemData, "id">) => {
        const newItem: AddPurchaseItemData = {
          ...item,
          id: generateItemId(),
        };

        set(
          (state) => ({
            items: [...state.items, newItem],
            submitError: null, // Clear any previous errors
          }),
          false,
          "addItem"
        );
      },

      updateItem: (id, updatedItem) => {
        set(
          (state) => ({
            items: state.items.map((item) =>
              item.id === id ? { ...item, ...updatedItem } : item
            ),
            submitError: null,
          }),
          false,
          "updateItem"
        );
      },

      removeItem: (id: number) => {
        set(
          (state) => ({
            items: state.items.filter((item) => item.id !== id),
            editingItemId:
              state.editingItemId === id ? null : state.editingItemId,
          }),
          false,
          "removeItem"
        );
      },

      getItemById: (id) => {
        const { items } = get();
        return items.find((item) => item.id === id);
      },

      setItems: (items) => {
        set({ items }, false, "setItems");
      },

      clearItems: () => {
        set({ items: [], editingItemId: null }, false, "clearItems");
      },

      // Editing
      setEditingItem: (id: number | null) => {
        set({ editingItemId: id }, false, "setEditingItem");
      },

      isEditing: (id: number) => {
        const { editingItemId } = get();
        return editingItemId === id;
      },

      // Calculations
      getSubtotal() {
        const { items, currency } = get();
        return items.reduce((sum, item) => {
          return (
            sum +
            convertCurrency(
              item.unit_cost * item.quantity,
              item.product_data.variants[0].cost_currency_id,
              currency
            )
          );
        }, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      getItemTotalAmount: (itemId: number) => {
        const { getItemById, currency } = get();
        const item = getItemById(itemId);

        if (!item) return 0;
        return convertCurrency(
          item.unit_cost * item.quantity,
          item.product_data.variants[0].cost_currency_id,
          currency
        );
      },

      getTotalPurchaseAmount: () => {
        const { getSubtotal } = get();
        return getSubtotal();
      },

      submitPurchase: async () => {
        const state = get();
        if (!state.vendor || state.items.length === 0) {
          const error =
            "Please fill all required fields and add at least one item";
          set({ submitError: error }, false, "submitPurchase/validation-error");
          throw new Error(error);
        }

        set(
          { isSubmitting: true, submitError: null },
          false,
          "submitPurchase/start"
        );

        try {
          const formData = new FormData();

          formData.append("vendor", state.vendor.toString());
          formData.append("currency", state.currency.toString());
          formData.append("notes", state.notes || "");
          // Step 1: Build stripped version of items (no image)
          const itemsForJson = state.items.map((item) => {
            if (item.variant_id) {
              return {
                ...item,
                unit_cost: convertCurrency(
                  item.unit_cost,
                  item.product_data.variants[0].cost_currency_id,
                  state.currency
                ),
                product_data: undefined,
              };
            }
            const variant = item.product_data?.variants[0];
            const { ...variantWithoutImage } = variant;
            // const image = variant.image
            delete variantWithoutImage.image;

            const { expiry_date, ...cleaned } = item;
            let cleanedItem;
            if (expiry_date != "") {
              cleanedItem = { ...cleaned, expiry_date: expiry_date };
            }

            return {
              ...cleanedItem,
              product_data: {
                ...item.product_data,
                variants: [variantWithoutImage],
              },
              unit_cost: convertCurrency(
                item.unit_cost,
                item.product_data.variants[0].cost_currency_id,
                state.currency
              ),
            };
          });

          // Step 2: Append items JSON string
          formData.append("items", JSON.stringify(itemsForJson));

          // Step 3: Append image files separately
          state.items.forEach((item, index) => {
            const image = item.product_data?.variants[0]?.image;
            if (image instanceof File) {
              formData.append(`variant_image_${index}`, image);
            }
          });
          let payment: {
            method: "cash" | "free" | "loan";
            cash_drawer?: number;
            currency?: number;
          };
          if (state.paymentMethod == "free" || state.paymentMethod == "loan") {
            payment = {
              method: state.paymentMethod,
            };
          } else {
            payment = {
              method: "cash",
              cash_drawer: state.paymentMethod.cash_drawer,
              currency: state.paymentMethod.currency,
            };
          }
          formData.append("payment", JSON.stringify(payment));
          const response = await apiClient.post(
            "/vendors/purchases/",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          set(
            { ...initialState, isSubmitting: false },
            false,
            "submitPurchase/success"
          );
          return response.data;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to submit purchase";
          set(
            { isSubmitting: false, submitError: errorMessage },
            false,
            "submitPurchase/error"
          );
          throw error;
        }
      },
      setPaymentMethod(method) {
        set(() => ({ paymentMethod: method }));
      },
      resetStore: () => {
        set(initialState, false, "resetStore");
      },
    })),
    {
      name: "add-purchase-store",
    }
  )
);
