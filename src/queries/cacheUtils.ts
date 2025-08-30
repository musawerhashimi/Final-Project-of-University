import type { QueryClient } from "@tanstack/react-query";
import type { PaginatedResponse } from "../entities/PaginatedResponse";

export function updateItemInAllInventoryQueries(
  queryClient: QueryClient,
  productId: number,
  preferenceType: string,
  newValue: boolean
) {
  const queries = queryClient
    .getQueryCache()
    .findAll({ predicate: (q) => q.queryKey[0] === "inventory" });

  for (const query of queries) {
    const queryKey = query.queryKey;

    const oldData = queryClient.getQueryData<{ pages: any }>(queryKey);
    if (!oldData || !oldData.pages) continue;

    const newData = {
      ...oldData,
      pages: oldData.pages.map((page: any) => ({
        ...page,
        results: page.results.map((item: any) => {
          if (item.variant !== productId) return item;
          return {
            ...item,
            [preferenceType]: newValue,
          };
        }),
      })),
    };

    queryClient.setQueryData(queryKey, newData);
  }
}

// Generic paginated cache updater to update one field of an item by ID
export function updatePaginatedItemFieldById<
  T extends { id: number; [key: string]: any }
>(
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  itemId: number,
  field: keyof T,
  value: T[typeof field]
) {
  queryClient.setQueryData<{ pages: PaginatedResponse<T>[] }>(
    queryKey,
    (old) => {
      if (!old || !old.pages) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          results: page.results.map((item) => {
            return item.id === itemId ? { ...item, [field]: value } : item;
          }),
        })),
      };
    }
  );
}
