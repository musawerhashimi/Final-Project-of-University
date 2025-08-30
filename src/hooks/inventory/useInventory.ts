// hooks/useInventory.ts
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useInventoryStore } from "../../stores/useInventoryStore";
import {
  inventoryService,
  type FetchInventoryParams,
  type TogglePreferenceParams,
} from "../../services/inventoryService";
import { useMemo } from "react";
import { updateInventoryItemFieldEverywhere } from "../../queries/inventoryUpdater";

export const useInventory = () => {
  // const queryClient = useQueryClient();
  const { filters, searchQuery } = useInventoryStore();

  // Create query key that includes filters and search
  const queryKey = useMemo(
    () => ["inventory", filters, searchQuery],
    [filters, searchQuery]
  );

  // Infinite query for paginated data
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const params: FetchInventoryParams = {
        page: pageParam,
        filters,
        search: searchQuery,
      };
      return inventoryService.fetchInventory(params);
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      const page = url.searchParams.get("page");
      return page ? parseInt(page) : undefined;
    },
    initialPageParam: 1,
    staleTime: 10 * 60 * 1000, // 5 minutes
    gcTime: 20 * 60 * 1000, // 10 minutes
  });
  const queryClient = useQueryClient();
  // Mutation for toggling preferences
  const togglePreferenceMutation = useMutation({
    mutationFn: inventoryService.togglePreference,
    onMutate: (newPreference: TogglePreferenceParams) => {
      const previousQueries = queryClient
        .getQueryCache()
        .findAll({ predicate: (q) => q.queryKey[0] === "inventory" })
        .map((q) => ({
          queryKey: q.queryKey,
          data: queryClient.getQueryData(q.queryKey),
        }));
      const inventory_id = items.find(
        (item) => item.variant === newPreference.product_id
      )?.id;
      if (inventory_id) {
        updateInventoryItemFieldEverywhere(
          inventory_id,
          newPreference.preference_type,
          !!newPreference.value
        );
      }

      return { previousQueries };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousQueries) {
        for (const { queryKey, data } of context.previousQueries) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ["inventory"] });
    // },
  });

  const items = data?.pages.flatMap((page) => page.results) || [];

  // Helper function to toggle preferences
  const togglePreference = (
    productId: number,
    preferenceType: "is_loved" | "is_bookmarked" | "is_favorite"
  ) => {
    const item = items.find((i) => i.variant === productId);
    if (!item) return;

    const currentValue = item[preferenceType];
    togglePreferenceMutation.mutate({
      product_id: productId,
      preference_type: preferenceType,
      value: !currentValue,
    });
  };

  return {
    totalCount: data?.pages[0]?.count || 0,
    items,

    // Loading states
    isLoading,
    isFetchingNextPage,
    isError,
    error,

    // Pagination
    hasNextPage,
    fetchNextPage,

    // Actions
    refetch,
    togglePreference,

    // Mutation states
    isTogglingPreference: togglePreferenceMutation.isPending,
  };
};
