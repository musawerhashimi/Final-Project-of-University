import { useState, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";

import RouteBox from "../../../components/RouteBox";
import { useReactToPrint } from "react-to-print";
import { useDirection } from "../../../hooks/useDirection";
import { useCurrencyStore } from "../../../stores";
import apiClient from "../../../lib/api";
import { useTranslation } from "react-i18next";
import { Printer } from "lucide-react";

// Updated SaleItem interface matching the actual API response
interface SaleItem {
  id: number;
  barcode: string;
  item: string;
  price: string;
  profit: number;
  discount: string;
  quantity: string;
  location: string;
  department: string;
  category: string;
  session_no: string;
  date: string;
  customer_acc_name: string | null;
  cost: number;
  currency: number;
  line_total: string;
  total_cost: number;
}

interface SalesApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SaleItem[];
}

// Helper function to format date to YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Function to fetch sales data from API
const fetchSalesData = async ({ pageParam = 1 }) => {
  const params = new URLSearchParams({
    page: pageParam.toString(),
  });

  const response = await apiClient.get(
    `/finance/sales-data/?${params.toString()}`
  );
  return response.data;
};

export default function SalesReport() {
  const { formatPriceWithCurrency } = useCurrencyStore();
  const { t } = useTranslation();
  const today = useMemo(() => formatDate(new Date()), []);
  const yesterday = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return formatDate(d);
  }, []);

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [appliedFromDate, setAppliedFromDate] = useState<string>("");

  const [appliedToDate, setAppliedToDate] = useState<string>("");

  // Use useInfiniteQuery for paginated data (no date filtering in query)
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
    queryKey: ["sales-data"], // Removed date dependencies since we filter frontend
    queryFn: ({ pageParam }) => fetchSalesData({ pageParam }),
    getNextPageParam: (lastPage: SalesApiResponse) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      const pageParam = url.searchParams.get("page");
      return pageParam ? parseInt(pageParam) : undefined;
    },
    initialPageParam: 1,
  });

  // Flatten all pages into a single array
  const allSalesData = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) || [];
  }, [data]);

  // Filter data based on applied date range (frontend filtering)
  const filteredSalesData = useMemo(() => {
    if (!allSalesData.length) return [];

    // If no date filters applied, return all data
    if (!appliedFromDate && !appliedToDate) return allSalesData;

    return allSalesData.filter((sale) => {
      const saleDate = new Date(sale.date);

      // If only from date is applied
      if (appliedFromDate && !appliedToDate) {
        const from = new Date(appliedFromDate);
        from.setHours(0, 0, 0, 0);
        return saleDate >= from;
      }

      // If only to date is applied
      if (!appliedFromDate && appliedToDate) {
        const to = new Date(appliedToDate);
        to.setHours(23, 59, 59, 999);
        return saleDate <= to;
      }

      // If both dates are applied
      if (appliedFromDate && appliedToDate) {
        const from = new Date(appliedFromDate);
        const to = new Date(appliedToDate);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        return saleDate >= from && saleDate <= to;
      }

      return true;
    });
  }, [allSalesData, appliedFromDate, appliedToDate]);

  // Handle date filter submission
  const handleDateFilterSubmit = () => {
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
    setAppliedFromDate("");
    setAppliedToDate("");
  };

  // Handle setting date to today
  const setDateToToday = () => {
    const todayDate = today;
    setFromDate(todayDate);
    setToDate(todayDate);
  };

  // Handle setting date to yesterday
  const setDateToYesterday = () => {
    const yesterdayDate = yesterday;
    setFromDate(yesterdayDate);
    setToDate(yesterdayDate);
  };

  const route = [
    { name: t("Reports"), path: "/reports" },
    { name: t("Sales Reports"), path: "" },
  ];

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .bg-blue-50 { background-color: #ebf8ff !important; }
        .bg-green-50 { background-color: #f0fff4 !important; }
      }
    `,
  });

  const direction = useDirection();

  if (isError) {
    return (
      <div className="w-full bg-slate-50 rounded-lg shadow-xl p-6">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-bold mb-2">
            {t("Error Loading Sales Data")}
          </h2>
          <p>
            {error?.message || "An error occurred while fetching sales data"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {t("Retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <RouteBox items={route} routlength={route.length} />

      <div className=" min-h-screen bg-green-50 mt-[-15px]  p-2">
        <h1 className="border-b-2 border-gray-200 p-2 rounded-md text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
          {t("Sales Report")}
        </h1>

        {/* Date Selection Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-8 p-4 rounded-lg shadow-inner bg-gray-50">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 lg:mb-0">
            <div className="flex items-center space-x-2">
              <label htmlFor="fromDate" className="text-gray-700 font-medium">
                {t("From")}:
              </label>
              <input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="toDate" className="text-gray-700 font-medium">
                {t("To")}:
              </label>
              <input
                type="date"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={setDateToYesterday}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
              >
                {t("Yesterday")}
              </button>
              <button
                onClick={setDateToToday}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
              >
                {t("Today")}
              </button>
              <button
                onClick={handleDateFilterSubmit}
                disabled={!fromDate && !toDate}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {t("Apply Filter")}
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
              >
                {t("Clear")}
              </button>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              className="bg-orange-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow print:hidden"
              title="Download PDF"
              onClick={reactToPrintFn}
              disabled={isLoading}
            >
              <Printer className="inline" /> {t("Print")}
            </button>
          </div>
        </div>

        {/* Active Filter Display */}
        {(appliedFromDate || appliedToDate) && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-blue-800 font-medium">
                  {t("Active Filter")}:
                </span>
                <span className="text-blue-700">
                  {appliedFromDate && appliedToDate
                    ? `${appliedFromDate} to ${appliedToDate}`
                    : appliedFromDate
                    ? `From ${appliedFromDate}`
                    : `Until ${appliedToDate}`}
                </span>
              </div>
              <button
                onClick={handleClearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                {t("Clear Filter")}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">{t("Loading sales data...")}</p>
          </div>
        )}

        {/* Sales Report Table with Infinite Scroll */}
        {!isLoading && (
          <div
            className="overflow-auto mx-auto w-96  md:w-[799px] lg:w-full  print:w-full rounded-lg shadow-md border border-gray-200 print:border-0 print:shadow-none print:rounded-none"
            dir={direction}
            ref={contentRef}
          >
            <h1 className="hidden print:block border-b-2 border-gray-200 p-2 rounded-md text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
              {t("Sales Report")}
              <span className="hidden print:inline text-sm text-blue-500">
                {" "}
                {appliedFromDate && appliedToDate ? (
                  <span className="text-sm text-blue-500">
                    {t("From")} {appliedFromDate} {t("To")} {appliedToDate}
                  </span>
                ) : appliedFromDate ? (
                  `From ${appliedFromDate}`
                ) : (
                  `Until  ${appliedToDate == "" ? new Date() : appliedToDate}`
                )}
              </span>
            </h1>

            <InfiniteScroll
              dataLength={filteredSalesData.length}
              next={fetchNextPage}
              hasMore={!!hasNextPage}
              loader={
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                  <p className="mt-2 text-sm text-gray-600">
                    {t("Loading more...")}
                  </p>
                </div>
              }
              endMessage={
                <div className="text-center py-4 text-gray-500">
                  <p>{t("No more sales data to load")}</p>
                </div>
              }
            >
              <table className="w-full">
                <thead className="bg-sky-100 ">
                  <tr>
                    <th className="px-1 py-3 print:text-[10px] whitespace-nowrap print:p-0 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Barcode")}
                    </th>
                    <th className="px-1 py-3 print:text-[10px] whitespace-nowrap print:p-0 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Items")}
                    </th>
                    <th className="px-1 py-3 print:text-[10px] whitespace-nowrap print:p-0 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Price")}
                    </th>
                    <th className="px-1 py-3 print:text-[10px] whitespace-nowrap print:p-0 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Cost")}
                    </th>
                    <th className="px-1 py-3 print:text-[10px] whitespace-nowrap print:p-0 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Profit")}
                    </th>
                    <th className="px-1 py-3 print:text-[10px] whitespace-nowrap print:p-0 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Dis")}
                    </th>
                    <th className="px-1 py-3 print:text-[10px] whitespace-nowrap print:p-0 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Qty")}
                    </th>
                    <th className="px-1 py-3 print:text-[10px] whitespace-nowrap print:p-0 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Location")}
                    </th>
                    <th className="px-1 py-3 print:text-[10px] whitespace-nowrap print:p-0 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Department")}
                    </th>
                    <th className="px-1 py-3 print:text-[10px] whitespace-nowrap print:p-0 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Category")}
                    </th>
                    <th className="px-1 py-3 print:text-[10px] whitespace-nowrap print:p-0 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Date")}
                    </th>
                    <th className="px-1 py-3 print:text-[10px] whitespace-nowrap print:p-0 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Customer Name")}
                    </th>
                    <th className="px-1 py-3 print:text-[10px] whitespace-nowrap print:p-0 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Total Price")}
                    </th>
                    <th className="px-1 py-3 print:text-[10px] whitespace-nowrap print:p-0 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Total Cost")}
                    </th>
                    <th className="px-1 py-3 print:text-[10px] whitespace-nowrap print:p-0 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Session No")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSalesData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={15}
                        className="px-1 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                      >
                        {allSalesData.length === 0
                          ? t("No sales data available.")
                          : t("No sales found for the selected date range.")}
                      </td>
                    </tr>
                  ) : (
                    filteredSalesData.map((sale, index) => (
                      <tr
                        key={`${sale.id}-${index}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-1 py-4 print:py-1 print:px-0 print:text-[10px] text-center whitespace-nowrap text-sm font-medium text-gray-900">
                          {sale.barcode}
                        </td>
                        <td className="px-1 py-4 print:py-1 print:px-0 print:text-[10px] text-center whitespace-nowrap text-sm text-gray-800">
                          {sale.item}
                        </td>
                        <td className="px-1 py-4 print:py-1 print:px-0 print:text-[10px] text-center whitespace-nowrap text-sm text-gray-800">
                          {formatPriceWithCurrency(
                            parseFloat(sale.price),
                            sale.currency
                          )}
                        </td>
                        <td className="px-1 py-4 print:py-1 print:px-0 print:text-[10px] text-center whitespace-nowrap text-sm text-gray-800">
                          {formatPriceWithCurrency(sale.cost, sale.currency)}
                        </td>
                        <td className="px-1 py-4 print:py-1 print:px-0 print:text-[10px] text-center whitespace-nowrap text-sm text-gray-800">
                          {formatPriceWithCurrency(sale.profit, sale.currency)}
                        </td>
                        <td className="px-1 py-4 print:py-1 print:px-0 print:text-[10px] text-center whitespace-nowrap text-sm text-gray-800">
                          {parseFloat(sale.discount).toFixed(2)}
                        </td>
                        <td className="px-1 py-4 print:py-1 print:px-0 print:text-[10px] text-center whitespace-nowrap text-sm text-gray-800">
                          {parseFloat(sale.quantity).toFixed(2)}
                        </td>
                        <td className="px-1 py-4 print:py-1 print:px-0 print:text-[10px] text-center whitespace-nowrap text-sm text-gray-800">
                          {sale.location}
                        </td>
                        <td className="px-1 py-4 print:py-1 print:px-0 print:text-[10px] text-center whitespace-nowrap text-sm text-gray-800">
                          {sale.department}
                        </td>
                        <td className="px-1 py-4 print:py-1 print:px-0 print:text-[10px] text-center whitespace-nowrap text-sm text-gray-800">
                          {sale.category}
                        </td>
                        <td className="px-1 py-4 print:py-1 print:px-0 print:text-[10px] text-center whitespace-nowrap text-sm text-gray-800">
                          {new Date(sale.date).toLocaleDateString()}
                        </td>
                        <td className="px-1 py-4 print:py-1 print:px-0 print:text-[10px] text-center whitespace-nowrap text-sm text-gray-800">
                          {sale.customer_acc_name || "N/A"}
                        </td>
                        <td className="px-1 py-4 print:py-1 print:px-0 print:text-[10px] text-center whitespace-nowrap text-sm text-gray-800">
                          {formatPriceWithCurrency(
                            parseFloat(sale.line_total),
                            sale.currency
                          )}
                        </td>
                        <td className="px-1 py-4 print:py-1 print:px-0 print:text-[10px] text-center whitespace-nowrap text-sm text-gray-800">
                          {formatPriceWithCurrency(
                            sale.total_cost,
                            sale.currency
                          )}
                        </td>
                        <td className="px-1 py-4 print:py-1 print:px-0 print:text-[10px] text-center whitespace-nowrap text-sm text-gray-800">
                          {sale.session_no}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </InfiniteScroll>
          </div>
        )}

        {/* Total Count Display */}
        {data && (
          <div className="mt-4 text-center text-gray-600">
            <p>
              {appliedFromDate || appliedToDate ? (
                <>
                  {t("Showing")} {filteredSalesData.length}{" "}
                  {t("filtered results of")} {allSalesData.length}{" "}
                  {t("loaded sales")}
                  {allSalesData.length < (data.pages[0]?.count || 0) &&
                    ` (${data.pages[0]?.count || 0} total in database)`}
                </>
              ) : (
                <>
                  {t("Showing")} {allSalesData.length} {t("of")}{" "}
                  {data.pages[0]?.count || 0} {t("total sales")}
                </>
              )}
              {isFetchingNextPage && t("Loading more...")}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
