// stores/useCurrencyStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type Currency } from "../entities/Currency";
import { HttpService } from "../lib/HttpService";
import { UI } from "../constants";
import { AxiosError } from "axios";

export interface CurrencyStore {
  currencies: Currency[];
  loading: boolean;
  error: string | null;

  // Actions
  setCurrencies: (currencies: Currency[]) => void;
  fetchCurrencies: () => Promise<void>;
  createCurrency: (
    currency: Omit<Currency, "id" | "decimal_places" | "is_base_currency">
  ) => Promise<void>;
  updateCurrency: (
    id: number,
    currency: Partial<Currency>
  ) => Promise<{ currency?: Currency; error?: string }>;
  deleteCurrency: (id: number) => Promise<void>;
  clearError: () => void;

  getCurrency: (currencyId: number) => Currency;
  convertCurrency: (
    amount: number,
    fromCurrencyId: number,
    toCurrencyId: number
  ) => number;
  formatPrice: (amount: number, currencyId: number) => string;
  getDecimalStep: (currencyId: number) => number;
  formatPriceWithCurrency: (amount: number, currencyId: number) => string;
  getCurrencyOptions: () => { key: number; value: string }[];
  getBaseCurrency: () => Currency;
}

const currencyService = new HttpService<Currency>("/core/currencies");

export const useCurrencyStore = create<CurrencyStore>()(
  devtools(
    (set, get) => ({
      currencies: [],
      loading: false,
      error: null,

      setCurrencies(currencies) {
        set(() => ({ currencies }));
      },
      fetchCurrencies: async () => {
        set({ loading: true, error: null });
        try {
          const currencies = await currencyService.getAll();
          set({ currencies, loading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch currencies",
            loading: false,
          });
        }
      },

      createCurrency: async (currency) => {
        set({ loading: true, error: null });
        try {
          const newCurrency = await currencyService.create(currency);
          set((state) => ({
            currencies: [...state.currencies, newCurrency],
            loading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof AxiosError
                ? error.response?.data
                : "Failed to create currency",
            loading: false,
          });
        }
      },

      updateCurrency: async (id, updates) => {
        const { currencies } = get();
        // Optimistic update
        const optimisticCurrencies = currencies.map((currency) =>
          currency.id === id ? { ...currency, ...updates } : currency
        );
        set({ currencies: optimisticCurrencies });

        try {
          const updatedCurrency = await currencyService.update(id, updates);
          set((state) => ({
            currencies: state.currencies.map((currency) =>
              currency.id === id ? updatedCurrency : currency
            ),
          }));
          return { currency: updatedCurrency };
        } catch (error) {
          set({ currencies });
          let flatMessage = "Failed to update currency";
          if (error instanceof AxiosError && error.response) {
            const err = error.response.data;
            flatMessage =
              typeof err === "string"
                ? err
                : typeof err === "object"
                ? Object.values(err).flat().join("\n")
                : flatMessage;
          }
          set({
            error: flatMessage,
            loading: false,
          });
          return { error: flatMessage };
        }
        //  catch (error) {
        //   // Revert optimistic update
        //   set({
        //     error:
        //       error instanceof AxiosError
        //         ? error.response?.data
        //         : "Failed to update currency",
        //   });
        // }
      },

      deleteCurrency: async (id) => {
        const { currencies } = get();
        // Optimistic update
        const optimisticCurrencies = currencies.filter(
          (currency) => currency.id !== id
        );
        set({ currencies: optimisticCurrencies });

        try {
          await currencyService.delete(id);
        } catch (error) {
          // Revert optimistic update
          set({ currencies });
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to delete currency",
          });
        }
      },

      clearError: () => set({ error: null }),

      getCurrency(currencyId) {
        const { currencies } = get();
        return currencies.find((c) => c.id === currencyId) || currencies[0];
      },

      convertCurrency(amount, fromCurrencyId, toCurrencyId) {
        const { getCurrency } = get();
        if (fromCurrencyId === toCurrencyId) return amount;

        const fromCurrency = getCurrency(fromCurrencyId);
        const toCurrency = getCurrency(toCurrencyId);

        if (!(fromCurrency && toCurrency)) return 0;
        // Convert to base currency first, then to target

        const baseAmount = amount / parseFloat(fromCurrency.exchange_rate);
        return baseAmount * parseFloat(toCurrency.exchange_rate);
      },

      formatPrice(amount, currencyId) {
        const { getCurrency } = get();
        const currency = getCurrency(currencyId);
        if (!currency) return amount;
        return amount.toFixed(currency.decimal_places);
      },

      getDecimalStep(currencyId) {
        const { getCurrency } = get();
        const currency = getCurrency(currencyId);
        return Math.pow(UI.DECIMAL_STEP_BASE, -currency.decimal_places);
      },

      formatPriceWithCurrency(amount, currencyId) {
        const { getCurrency, formatPrice } = get();

        const currency = getCurrency(currencyId);
        const formattedPrice = formatPrice(amount, currencyId);
        return `${formattedPrice} ${currency.code}`;
      },
      getCurrencyOptions() {
        const { currencies } = get();
        return currencies.map((currency) => ({
          key: currency.id,
          value: currency.code,
        }));
      },
      getBaseCurrency() {
        const { currencies } = get();
        return currencies.find((c) => c.is_base_currency);
      },
    }),
    { name: "currency-store" }
  )
);

export const getBaseCurrency = useCurrencyStore.getState().getBaseCurrency;
export const convertCurrency = useCurrencyStore.getState().convertCurrency;
export const getCurrency = useCurrencyStore.getState().getCurrency;
