import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Check, Eye } from "lucide-react";
import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import RouteBox from "../../../../components/RouteBox";
import type { PaginatedResponse } from "../../../../entities/PaginatedResponse";
import { apiClient } from "../../../../lib/api";
import { useCurrencyStore } from "../../../../stores/useCurrencyStore";
import { formatLocalDateTime } from "../../../../utils/formatLocalDateTime";
import ReceiveModal from "./ReceiveModal";
import { useTranslation } from "react-i18next";

interface PurchaseItem {
  id: number;
  purchase_number: string;
  vendor_name: string;
  location_name: string;
  purchase_date: string;
  currency: number;
  total_amount: string;
  status: "received" | "pending";
  total_items: number;
  total_quantity: number;
  notes: string;
}

type StatusFilter = "all" | "pending" | "received";

export default function PurchaseList() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(
    null
  );
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const queryClient = useQueryClient();
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );

  const routebox = [
    { path: "/purchase", name: t("Purchase") },
    { path: "/purchase/purchaseList", name: t("Purchase List") },
  ];

  const fetchPurchases = async ({ pageParam = 1 }) => {
    const params = new URLSearchParams({
      page: pageParam.toString(),
      ...(statusFilter !== "all" && { status: statusFilter }),
    });

    const response = await apiClient.get<PaginatedResponse<PurchaseItem>>(
      `/vendors/purchases/?${params}`
    );
    return response.data;
  };

  const { data, fetchNextPage, hasNextPage, isLoading, error } =
    useInfiniteQuery({
      queryKey: ["purchases", statusFilter],
      queryFn: fetchPurchases,
      getNextPageParam: (lastPage) => {
        if (!lastPage.next) return undefined;
        const url = new URL(lastPage.next);
        return parseInt(url.searchParams.get("page") || "0") ?? undefined;
      },
      initialPageParam: 1,
    });

  const receivePurchaseMutation = useMutation({
    mutationFn: async ({
      purchaseId,
      locationId,
    }: {
      purchaseId: number;
      locationId: number;
    }) => {
      const response = await apiClient.post(
        `/vendors/purchases/${purchaseId}/mark_received/`,
        {
          location_id: locationId,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      setIsReceiveModalOpen(false);
      setSelectedPurchase(null);
      toast.success(
        `${t("Purchase")}: ${
          selectedPurchase?.purchase_number
        } ${"received successfully!"}`
      );
    },
    onError: (err: AxiosError<{ error: string }>) => {
      toast.error(
        err.response?.data?.error ||
          t("Faild to Receive purchase: ") + selectedPurchase?.purchase_number
      );
    },
  });

  const allPurchases = data?.pages.flatMap((page) => page.results) || [];

  const handleReceive = (purchase: PurchaseItem) => {
    setSelectedPurchase(purchase);
    setIsReceiveModalOpen(true);
  };

  const handleReceiveSubmit = (locationId: number) => {
    if (selectedPurchase) {
      receivePurchaseMutation.mutate({
        purchaseId: selectedPurchase.id,
        locationId,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    if (status === "received") {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else if (status === "pending") {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
    return `${baseClasses} bg-gray-100 text-gray-800`;
  };

  if (error) {
    return (
      <div className="p-5 m-3 shadow-md rounded-md bg-white">
        <div className="text-red-500 text-center p-4">
          {t("Error loading purchases:")} {error.message}
        </div>
      </div>
    );
  }

  return (
    <>
      <RouteBox items={routebox} routlength={routebox.length} />

      <div className="p-5 m-3 shadow-muted-front shadow-md rounded-md">
        {/* Header with Filter */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("Purchases List")}
          </h2>
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaFilter className="text-sm" />
              {t("Filter")}
            </button>

            {isFilterOpen && (
              <div className="absolute end-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                <div className="py-2">
                  {[
                    { value: "all", label: t("All Purchases") },
                    { value: "pending", label: t("Pending") },
                    { value: "received", label: t("Received") },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value as StatusFilter);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                        statusFilter === option.value
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Purchase Count */}
        <div className="mb-4 text-gray-600">
          {t("Total")}:{" "}
          <span className="text-blue-500 font-bold">
            {data?.pages[0]?.count || 0}
          </span>{" "}
          {t("Purchase")}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <InfiniteScroll
            dataLength={allPurchases.length}
            next={fetchNextPage}
            hasMore={hasNextPage || false}
            loader={
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">
                  {t("Loading more purchases...")}
                </span>
              </div>
            }
            endMessage={
              <div className="text-center py-4 text-gray-500">
                {allPurchases.length === 0
                  ? t("No purchases found")
                  : t("No more purchases to load")}
              </div>
            }
          >
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    {t("Purchase #")}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    {t("Date")}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    {t("Vendor")}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    {t("Location")}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    {t("Total Items")}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    {t("Total Amount")}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    {t("Status")}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    {t("Actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <div className="mt-2 text-gray-600">
                        {t("Loading purchases...")}
                      </div>
                    </td>
                  </tr>
                ) : allPurchases.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      {t("No purchases found")}
                    </td>
                  </tr>
                ) : (
                  allPurchases.map((purchase) => (
                    <tr
                      key={purchase.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                        {purchase.purchase_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                        {formatLocalDateTime(purchase.purchase_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {purchase.vendor_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                        {purchase.location_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                        {purchase.total_items} {t("items")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                        {formatPriceWithCurrency(
                          parseFloat(purchase.total_amount),
                          purchase.currency
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={getStatusBadge(purchase.status)}>
                          {purchase.status.charAt(0).toUpperCase() +
                            purchase.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-center ">
                        <div className="flex flex-col gap-1">
                          <Link
                            to={`/purchase/purchaseList/purchaseListDetails/${purchase.id}`}
                            title="View Details"
                          >
                            <button
                              title="Mark as Received"
                              onClick={() => handleReceive(purchase)}
                              className="w-full  text-center py-1 px-2 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                            >
                              <Eye className="w-4 h-4 inline" />
                              {t("View")}
                            </button>
                          </Link>
                          {purchase.status === "pending" && (
                            <div>
                              <button
                                onClick={() => handleReceive(purchase)}
                                className="w-full items-center px-2 py-1 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                              >
                                <Check className="w-4 h-4 me-1 inline" />{" "}
                                {t("Receive")}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </InfiniteScroll>
        </div>
      </div>

      {/* Receive Modal */}
      <ReceiveModal
        isOpen={isReceiveModalOpen}
        onClose={() => {
          setIsReceiveModalOpen(false);
          setSelectedPurchase(null);
        }}
        onSubmit={handleReceiveSubmit}
        isLoading={receivePurchaseMutation.isPending}
        purchaseNumber={selectedPurchase?.purchase_number || ""}
      />
    </>
  );
}
