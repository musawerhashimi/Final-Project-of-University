import type { InventoryItem } from "../entities/InventoryItem";
import { queryClient } from "../lib/queryClient";
import { updatePaginatedItemFieldById } from "./cacheUtils";

// Update all paginated inventory queries with the updated field value on matching item
export function updateInventoryItemFieldEverywhere<
  T extends keyof InventoryItem
>(itemId: number, field: T, value: InventoryItem[T]) {
  const allQueries = queryClient
    .getQueryCache()
    .findAll({ predicate: (q) => q.queryKey[0] === "inventory" });
  for (const query of allQueries) {
    updatePaginatedItemFieldById<InventoryItem>(
      queryClient,
      query.queryKey,
      itemId,
      field,
      value
    );
  }
}
