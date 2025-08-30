// stores/useLocationStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type Location } from "../entities/Location";
import { HttpService } from "../lib/HttpService";

interface LocationStore {
  locations: Location[];
  loading: boolean;
  error: string | null;

  // Actions
  setLocations: (locations: Location[]) => void;
  fetchLocations: () => Promise<void>;
  createLocation: (
    location: Omit<Location, "id" | "total_products" | "total_quantity">
  ) => Promise<void>;
  updateLocation: (id: number, location: Partial<Location>) => Promise<void>;
  deleteLocation: (id: number) => Promise<void>;
  getStores: () => Location[];
  getWarehouses: () => Location[];
  clearError: () => void;
}

const locationService = new HttpService<Location>("/inventory/locations");

export const useLocationStore = create<LocationStore>()(
  devtools(
    (set, get) => ({
      locations: [],
      loading: false,
      error: null,

      setLocations(locations) {
        set(() => ({ locations }));
      },
      fetchLocations: async () => {
        set({ loading: true, error: null });
        try {
          const locations = await locationService.getAll();
          set({ locations, loading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch locations",
            loading: false,
          });
        }
      },

      createLocation: async (location) => {
        set({ loading: true, error: null });
        try {
          const newLocation = await locationService.create(location);
          set((state) => ({
            locations: [...state.locations, newLocation],
            loading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to create location",
            loading: false,
          });
        }
      },

      updateLocation: async (id, updates) => {
        const { locations } = get();
        // Optimistic update
        const optimisticLocations = locations.map((location) =>
          location.id === id ? { ...location, ...updates } : location
        );
        set({ locations: optimisticLocations });

        try {
          const updatedLocation = await locationService.update(id, updates);
          set((state) => ({
            locations: state.locations.map((location) =>
              location.id === id ? updatedLocation : location
            ),
          }));
        } catch (error) {
          // Revert optimistic update
          set({ locations });
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update location",
          });
        }
      },

      deleteLocation: async (id) => {
        const { locations } = get();
        // Optimistic update
        const optimisticLocations = locations.filter(
          (location) => location.id !== id
        );
        set({ locations: optimisticLocations });

        try {
          await locationService.delete(id);
        } catch (error) {
          // Revert optimistic update
          set({ locations });
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to delete location",
          });
        }
      },

      getStores() {
        const { locations } = get();
        return locations.filter((l) => l.location_type === "store");
      },

      getWarehouses() {
        const { locations } = get();
        return locations.filter((l) => l.location_type === "warehouse");
      },

      clearError: () => set({ error: null }),
    }),
    { name: "location-store" }
  )
);
