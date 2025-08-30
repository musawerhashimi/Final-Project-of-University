import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api";
import { type InventoryItem } from "../entities/InventoryItem";
import { type PaginatedResponse } from "../entities/PaginatedResponse";
import { useInventoryStore } from "../stores/useInventoryStore";

export const useInventoryInfinite = () => {
  const addItems = useInventoryStore(s => s.addItems)
  const clearItems = useInventoryStore(s => s.clearItems)
  return useInfiniteQuery<PaginatedResponse<InventoryItem>>({
    queryKey: ["inventory"],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiClient
        .get<PaginatedResponse<InventoryItem>>("/inventory?page=" + pageParam);
      if (pageParam == 1) {
        clearItems();
      }
      addItems(res.data.results);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return url.searchParams.get("page") ?? undefined;
    },
  });
};
