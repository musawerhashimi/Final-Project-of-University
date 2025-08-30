// stores/useUnitStore.ts
import { toast } from "sonner";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type Unit } from "../entities/Unit";
import { HttpService } from "../lib/HttpService";
import { extractAxiosError } from "../utils/extractError";

interface UnitStore {
  units: Unit[];
  loading: boolean;
  error: string | null;

  // Actions
  setUnits: (units: Unit[]) => void;
  fetchUnits: () => Promise<void>;
  createUnit: (
    unit: Omit<
      Unit,
      "id" | "unit_type" | "base_unit" | "conversion_factor" | "is_base_unit"
    >
  ) => Promise<void>;
  updateUnit: (id: number, unit: Partial<Unit>) => Promise<void>;
  deleteUnit: (id: number) => Promise<void>;
  getUnitById: (id: number) => Unit;
  clearError: () => void;
}

const unitService = new HttpService<Unit>("/core/units");

export const useUnitStore = create<UnitStore>()(
  devtools(
    (set, get) => ({
      units: [],
      loading: false,
      error: null,

      setUnits(units) {
        set(() => ({ units }));
      },
      fetchUnits: async () => {
        set({ loading: true, error: null });
        try {
          const units = await unitService.getAll();
          set({ units, loading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch units",
            loading: false,
          });
        }
      },

      createUnit: async (unit) => {
        set({ loading: true, error: null });
        const loadingToast = toast.loading("Creating Unit...");
        try {
          const newUnit = await unitService.create(unit);
          set((state) => ({
            units: [...state.units, newUnit],
            loading: false,
          }));
          toast.success("Unit Created Successfully");
        } catch (error) {
          const errorMessage = extractAxiosError(
            error,
            "Failed to create unit"
          );
          set({
            error: errorMessage,
            loading: false,
          });
          toast.error(errorMessage);
        } finally {
          toast.dismiss(loadingToast);
        }
      },

      updateUnit: async (id, updates) => {
        const { units } = get();
        // Optimistic update
        const optimisticUnits = units.map((unit) =>
          unit.id === id ? { ...unit, ...updates } : unit
        );
        set({ units: optimisticUnits });
        try {
          const updatedUnit = await unitService.update(id, updates);
          set((state) => ({
            units: state.units.map((unit) =>
              unit.id === id ? updatedUnit : unit
            ),
          }));
          toast.success("Unit Updated Successfully!");
        } catch (error) {
          // Revert optimistic update
          set({ units });
          const errorMessage = extractAxiosError(
            error,
            "Failed to update unit"
          );
          set({
            error: errorMessage,
          });
          toast.error(errorMessage);
        }
      },

      deleteUnit: async (id) => {
        const { units } = get();
        // Optimistic update
        const optimisticUnits = units.filter((unit) => unit.id !== id);
        set({ units: optimisticUnits });

        try {
          await unitService.delete(id);
        } catch (error) {
          // Revert optimistic update
          set({ units });
          set({
            error:
              error instanceof Error ? error.message : "Failed to delete unit",
          });
        }
      },

      getUnitById(id) {
        const { units } = get();
        return units.find((u) => u.id === id);
      },

      clearError: () => set({ error: null }),
    }),
    { name: "unit-store" }
  )
);
