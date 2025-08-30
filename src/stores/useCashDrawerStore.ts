// stores/useCashDrawerStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { HttpService } from "../lib/HttpService";
import type { CashDrawer } from "../entities/CashDrawer";
import { AxiosError } from "axios";

interface CashDrawerStore {
  cashDrawers: CashDrawer[];
  loading: boolean;
  error: string | null;

  // Actions
  setCashDrawers: (cashDrawers: CashDrawer[]) => void;
  fetchCashDrawers: () => Promise<void>;
  createCashDrawer: (
    drawer: Omit<CashDrawer, "id" | "amounts">
  ) => Promise<void>;
  updateCashDrawer: (id: number, drawer: Partial<CashDrawer>) => Promise<void>;
  deleteCashDrawer: (id: number) => Promise<void>;
  clearError: () => void;
}

const cashDrawerService = new HttpService<CashDrawer>("finance/cash-drawers");

export const useCashDrawerStore = create<CashDrawerStore>()(
  devtools(
    (set, get) => ({
      cashDrawers: [],
      loading: false,
      error: null,

      setCashDrawers(cashDrawers) {
        set(() => ({ cashDrawers }));
      },
      fetchCashDrawers: async () => {
        set({ loading: true, error: null });
        try {
          const cashDrawers = await cashDrawerService.getAll();
          set({ cashDrawers, loading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch cash drawers",
            loading: false,
          });
        }
      },

      createCashDrawer: async (drawer) => {
        set({ loading: true, error: null });
        try {
          const newDrawer = await cashDrawerService.create(drawer);
          set((state) => ({
            cashDrawers: [...state.cashDrawers, newDrawer],
            loading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof AxiosError
                ? error.response?.data.message
                : "Failed to create cash drawer",
            loading: false,
          });
        }
      },

      updateCashDrawer: async (id, updates) => {
        const { cashDrawers } = get();
        // Optimistic update
        const optimisticDrawers = cashDrawers.map((drawer) =>
          drawer.id === id ? { ...drawer, ...updates } : drawer
        );
        set({ cashDrawers: optimisticDrawers });

        try {
          const updatedDrawer = await cashDrawerService.update(id, updates);
          set((state) => ({
            cashDrawers: state.cashDrawers.map((drawer) =>
              drawer.id === id ? updatedDrawer : drawer
            ),
          }));
        } catch (error) {
          // Revert optimistic update
          set({ cashDrawers });
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update cash drawer",
          });
        }
      },

      deleteCashDrawer: async (id) => {
        const { cashDrawers } = get();
        // Optimistic update
        const optimisticDrawers = cashDrawers.filter(
          (drawer) => drawer.id !== id
        );
        set({ cashDrawers: optimisticDrawers });

        try {
          await cashDrawerService.delete(id);
        } catch (error) {
          // Revert optimistic update
          set({ cashDrawers });
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to delete cash drawer",
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: "cash-drawer-store" }
  )
);
