import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api"; // adjust path
import type { Receipt } from "../entities/Receipt"; // adjust path

export const useReceipts = () => {
  return useQuery<Receipt[]>({
    queryKey: ["receipts"],
    queryFn: async () => {
      const response = await apiClient.get("/sales/sales");
      return response.data;
    },
  });
};
