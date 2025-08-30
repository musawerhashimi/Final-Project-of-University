// services/inventoryService.ts
import type { InventoryItem } from "../entities/InventoryItem";
import type { PaginatedResponse } from "../entities/PaginatedResponse";
import { apiClient } from "../lib/api";
import type { InventoryFilters } from "../stores/useInventoryStore";

export interface FetchInventoryParams {
  page?: number;
  filters?: InventoryFilters;
  search?: string;
}

export interface TogglePreferenceParams {
  product_id: number;
  preference_type: "is_loved" | "is_bookmarked" | "is_favorite";
  value?: boolean;
}

export class InventoryService {
  private endpoint = "/inventory/";
  private preferencesEndpoint = "/accounts/product-preferences/";

  async fetchInventory(
    params: FetchInventoryParams = {}
  ): Promise<PaginatedResponse<InventoryItem>> {
    const { page = 1, filters = {}, search = "" } = params;

    const searchParams = new URLSearchParams();
    searchParams.append("page", page.toString());

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    // Add search - search both product_name and barcode
    if (search.trim()) {
      searchParams.append("search", search.trim());
    }

    const response = await apiClient.get<PaginatedResponse<InventoryItem>>(
      `${this.endpoint}?${searchParams.toString()}`
    );

    return response.data;
  }

  togglePreference = async (params: TogglePreferenceParams): Promise<void> => {
    await apiClient.post(this.preferencesEndpoint, {
      product_id: params.product_id,
      preference_type: params.preference_type,
      value: params.value,
    });
  };
}

export const inventoryService = new InventoryService();
