// hooks/useProducts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsService } from "../lib/api";
import { type ProductData } from "../entities/ProductData";

// Query keys
export const QUERY_KEYS = {
  PRODUCTS: ["products"] as const,
  PRODUCT: (id: number) => ["products", id] as const,
};

// Get all products
export const useProducts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS,
    queryFn: productsService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Get single product
export const useProduct = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT(id),
    queryFn: () => productsService.getById(id),
    enabled: !!id,
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsService.create,
    onSuccess: (new_product) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });

      // Update Product list Query
      // queryClient.setQueryData<ProductData[]>(
      //   QUERY_KEYS.PRODUCTS,
      //   (products = []) => [...products, new_product]
      // );
      // queryClient.setQueryData<ProductData>(
      //   QUERY_KEYS.PRODUCT(new_product.id),
      //   () => new_product
      // );
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
      product: Partial<ProductData>;
    }) => productsService.update(id, product),
    onSuccess: (data, variables) => {
      // Update the specific product in cache
      queryClient.setQueryData(QUERY_KEYS.PRODUCT(variables.id), data);
      // Invalidate products list to ensure consistency
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsService.delete,
    onSuccess: (_, productId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.PRODUCT(productId) });
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
    },
  });
};
