// stores/useVendorStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type Vendor } from "../entities/Vendor";
import apiClient from "../lib/api";
import { HttpService } from "../lib/HttpService";
import { convertCurrency, getBaseCurrency } from "./useCurrencyStore";
import { extractAxiosError } from "../utils/extractError";

interface NewVendor {
  name: string;
  email: string;
  phone?: string;
  photo?: File;
}

interface VendorResponse {
  vendor?: Vendor;
  error?: string;
}

interface VendorStore {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;

  // Actions
  setVendors: (vendors: Vendor[]) => void;
  fetchVendors: () => Promise<void>;
  createVendor: (vendor: NewVendor) => Promise<VendorResponse>;
  updateVendor: (
    id: number,
    vendor: Omit<NewVendor, "photo">
  ) => Promise<VendorResponse>;
  updateVendorPhoto: (
    id: number,
    photo: File
  ) => Promise<{ photo?: string; error?: string }>;
  updateVendorBalance: (
    id: number,
    extraBalance: number,
    currencyId?: number
  ) => void;
  deleteVendor: (id: number) => Promise<void>;
  clearError: () => void;
  getVendorById: (id: number) => Vendor;
}

const vendorService = new HttpService<Vendor>("/vendors/vendors");

export const useVendorStore = create<VendorStore>()(
  devtools(
    (set, get) => ({
      vendors: [],
      loading: false,
      error: null,

      setVendors(vendors) {
        set(() => ({ vendors }));
      },
      fetchVendors: async () => {
        set({ loading: true, error: null });
        try {
          const vendors = await vendorService.getAll();
          set({ vendors, loading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch vendors",
            loading: false,
          });
        }
      },

      createVendor: async (vendor) => {
        // return;
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          Object.entries(vendor).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formData.append(key, value);
            }
          });
          const newVendor = (
            await apiClient.post<Vendor>("/vendors/vendors/", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
          ).data;
          set((state) => ({
            vendors: [...state.vendors, newVendor],
            loading: false,
          }));
          return { vendor: newVendor };
        } catch (error) {
          const errorMessage = extractAxiosError(
            error,
            "Failed to create vendor"
          );
          set({
            error: errorMessage,
            loading: false,
          });
          return { error: errorMessage };
        }
      },

      updateVendor: async (id, updates) => {
        const { vendors } = get();
        // Optimistic update
        const optimisticVendors = vendors.map((vendor) =>
          vendor.id === id ? { ...vendor, ...updates } : vendor
        );
        set({ vendors: optimisticVendors });

        try {
          const updatedVendor = await vendorService.update(id, updates);
          set((state) => ({
            vendors: state.vendors.map((vendor) =>
              vendor.id === id ? updatedVendor : vendor
            ),
          }));
          return { vendor: updatedVendor };
        } catch (error) {
          // Revert optimistic update
          set({ vendors });
          const errorMessage = extractAxiosError(
            error,
            "Failed to update vendor"
          );

          set({
            error: errorMessage,
          });
          return { error: errorMessage };
        }
      },

      async updateVendorPhoto(id, photo) {
        const formData = new FormData();
        formData.append("photo", photo);
        try {
          const photo = (
            await apiClient.patch<string>(
              `/vendors/vendors/${id}/photo/`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
          ).data;
          set((state) => ({
            vendors: state.vendors.map((v) =>
              v.id === id ? { ...v, photo } : v
            ),
          }));
          return { photo };
        } catch (error) {
          // Revert optimistic update
          const errorMessage = extractAxiosError(
            error,
            "Failed to update vendor"
          );

          set({
            error: errorMessage,
          });
          return { error: errorMessage };
        }
      },

      deleteVendor: async (id) => {
        const { vendors } = get();
        // Optimistic update
        const optimisticVendors = vendors.filter((vendor) => vendor.id !== id);
        set({ vendors: optimisticVendors });

        try {
          await vendorService.delete(id);
        } catch (error) {
          // Revert optimistic update
          set({ vendors });
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to delete vendor",
          });
        }
      },
      getVendorById(id) {
        const { vendors } = get();
        return vendors.find((v) => v.id === id);
      },
      updateVendorBalance(id, extraBalance, currencyId) {
        const baseCurrencyId = getBaseCurrency().id;
        const baseBalance = convertCurrency(
          extraBalance,
          currencyId || baseCurrencyId,
          baseCurrencyId
        );

        set((state) => ({
          vendors: state.vendors.map((v) =>
            v.id === id
              ? { ...v, balance: String(parseFloat(v.balance) + baseBalance) }
              : v
          ),
        }));
      },

      clearError: () => set({ error: null }),
    }),
    { name: "vendor-store" }
  )
);
