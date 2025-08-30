// // hooks/useVendorPurchases.ts
// import { useQuery } from "@tanstack/react-query";
// import apiClient from "../lib/api"; // adjust path to your apiClient
// import type { VendorPurchase } from "../entities/Purchase";

// export const useVendorPurchases = (vendorId: number) => {
//   return useQuery<VendorPurchase[]>({
//     queryKey: ["vendor-purchases", vendorId],
//     queryFn: async () => {
//       const response = await apiClient.get(
//         `vendors/vendors/${vendorId}/purchases/`
//       );
//       return response.data as VendorPurchase[];
//     },
//     staleTime: 1000 * 60 * 5, // optional: 5 minutes
//     enabled: !!vendorId, // only run if vendorId is truthy
//   });
// };

//---------------------------change it by musawer----------
// hooks/useVendorPurchases.ts
import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/api"; // adjust path to your apiClient
import type { VendorPurchase } from "../entities/Purchase";

export const useVendorPurchases = (vendorId: number) => {
  return useQuery<VendorPurchase[]>({
    queryKey: ["vendor-purchases", vendorId],
    queryFn: async () => {
      const response = await apiClient.get(
        `vendors/vendors/${vendorId}/purchases/`
      );
      return response.data as VendorPurchase[];
    },
    staleTime: 1000 * 60 * 5, // optional: 5 minutes
    enabled: !!vendorId, // only run if vendorId is truthy
  });
};
