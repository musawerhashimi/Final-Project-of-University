// hooks/useProducts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPurchaseService } from "../lib/api";
import { type AddPurchaseData } from "../entities/AddPurchaseData";

// Query keys
export const QUERY_KEYS = {
  PURCHASES: ["purchases"] as const,
  PURCHASE: (id: number) => ["purchase", id] as const,
};

// Get all products
export const useProducts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PURCHASES,
    queryFn: addPurchaseService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Get single product
export const usePurchase = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.PURCHASE(id),
    queryFn: () => addPurchaseService.getById(id),
    enabled: !!id,
  });
};

// Create purchase mutation
export const useCreatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPurchaseService.create,
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES });
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      product,
    }: {
      id: number;
      product: Partial<AddPurchaseData>;
    }) => addPurchaseService.update(id, product),
    onSuccess: (data, variables) => {
      // Update the specific product in cache
      queryClient.setQueryData(QUERY_KEYS.PURCHASE(variables.id), data);

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES });
    },
  });
};
