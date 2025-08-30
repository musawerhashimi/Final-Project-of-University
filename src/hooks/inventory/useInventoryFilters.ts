// hooks/useInventoryFilters.ts
import { useInventoryStore } from "../../stores/useInventoryStore";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { InventoryFilters } from "../../stores/useInventoryStore";

export const useInventoryFilters = () => {
  const queryClient = useQueryClient();
  const {
    filters,
    searchQuery,
    // setFilters,
    updateFilter,
    setSearchQuery,
    clearFilters,
  } = useInventoryStore();

  // Clear items and invalidate queries when filters change
  const invalidateAndClear = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["inventory"] });
  }, [queryClient]);

  const updateFilterAndRefetch = useCallback(
    (key: keyof InventoryFilters, value?: string | boolean | number) => {
      updateFilter(key, value);
      invalidateAndClear();
    },
    [updateFilter, invalidateAndClear]
  );

  const updateSearchAndRefetch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      clearFilters();
      invalidateAndClear();
    },
    [setSearchQuery, clearFilters, invalidateAndClear]
  );

  const clearFiltersAndRefetch = useCallback(() => {
    clearFilters();
    invalidateAndClear();
  }, [clearFilters, invalidateAndClear]);

  return {
    filters,
    searchQuery,
    updateFilter: updateFilterAndRefetch,
    setSearchQuery: updateSearchAndRefetch,
    clearFilters: clearFiltersAndRefetch,

    // Helper methods for specific filters
    toggleLoved: useCallback(
      (value?: boolean) => updateFilterAndRefetch("is_loved", value),
      [updateFilterAndRefetch]
    ),

    toggleBookmarked: useCallback(
      (value?: boolean) => updateFilterAndRefetch("is_bookmarked", value),
      [updateFilterAndRefetch]
    ),

    toggleFavorite: useCallback(
      (value?: boolean) => updateFilterAndRefetch("is_favorite", value),
      [updateFilterAndRefetch]
    ),

    setCategory: useCallback(
      (categoryId?: number) =>
        updateFilterAndRefetch("category_id", categoryId),
      [updateFilterAndRefetch]
    ),

    setDepartment: useCallback(
      (departmentId?: number) =>
        updateFilterAndRefetch("department_id", departmentId),
      [updateFilterAndRefetch]
    ),
    setWarehouse: useCallback(
      (wharehouseId?: number) =>
        updateFilterAndRefetch("warehouse_id", wharehouseId),
      [updateFilterAndRefetch]
    ),
  };
};
