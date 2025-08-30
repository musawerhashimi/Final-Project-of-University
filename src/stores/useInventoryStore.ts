// stores/inventoryStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface InventoryFilters {
  is_loved?: boolean;
  is_bookmarked?: boolean;
  is_favorite?: boolean;
  category_id?: number;
  department_id?: number;
  warehouse_id?: number;
  search?: string;
}

export interface InventoryState {
  // Data

  // Filters and search
  filters: InventoryFilters;
  searchQuery: string;

  // Actions
  setFilters: (filters: InventoryFilters) => void;
  updateFilter: <Key extends keyof InventoryFilters>(
    key: Key,
    value: InventoryFilters[Key]
  ) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
}

const initialState = {
  filters: {},
  searchQuery: "",
};

export const useInventoryStore = create<InventoryState>()(
  devtools(
    (set) => ({
      ...initialState,
      setFilters: (filters) => set({ filters }),
      updateFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      clearFilters: () => set({ filters: {} }),
    }),
    {
      name: "inventory-store",
    }
  )
);
