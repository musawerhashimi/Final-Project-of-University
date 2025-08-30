import { useState, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import RouteBox from "../../../components/RouteBox";
import { useDirection } from "../../../hooks/useDirection";
import { useReactToPrint } from "react-to-print";
import apiClient from "../../../lib/api";
import { useCurrencyStore } from "../../../stores";
import { useTranslation } from "react-i18next";
import { Printer } from "lucide-react";

interface Customer {
  id: number;
  name: string;
  email: string;
  customer_number: string;
  phone: string;
  balance: string;
  address: string;
}

// Define the paginated response interface
interface PaginatedCustomersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Customer[];
}

// Define filter types
type FilterType = "all" | "positive" | "negative";

// API function to fetch customers with pagination
const fetchCustomers = async ({
  pageParam = 1,
}): Promise<PaginatedCustomersResponse> => {
  const response = await apiClient.get(
    `/customers/customers/?page=${pageParam}`
  );
  return response.data;
};

export default function CustomerReport() {
  const { t } = useTranslation();
  const [filterType, setFilterType] = useState<FilterType>("all");
  const { formatPriceWithCurrency } = useCurrencyStore();

  // Fetch customers data using React Query's useInfiniteQuery
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If there's a next page, return the next page number
      if (lastPage.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Flatten all pages of customers into a single array
  const allCustomers = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.results);
  }, [data]);

  // Memoize filtered customers to avoid unnecessary re-renders
  const filteredCustomers = useMemo(() => {
    if (!allCustomers || allCustomers.length === 0) return [];

    switch (filterType) {
      case "positive":
        return allCustomers.filter(
          (customer) => parseFloat(customer.balance) > 0
        );
      case "negative":
        return allCustomers.filter(
          (customer) => parseFloat(customer.balance) < 0
        );
      default:
        return allCustomers;
    }
  }, [allCustomers, filterType]);

  // Function to handle filter button click
  const handleFilterChange = () => {
    setFilterType((prevType) => {
      if (prevType === "all") return "positive";
      if (prevType === "positive") return "negative";
      return "all";
    });
  };

  // Function to get the current filter button text
  const getFilterButtonText = () => {
    switch (filterType) {
      case "all":
        return t("Show Positive Balances");
      case "positive":
        return t("Show Negative Balances");
      case "negative":
        return t("Show All Balances");
    }
  };

  const route = [
    { name: t("Reports"), path: "/reports" },
    { name: t("Customers Report"), path: "" },
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

  // Get total count from the first page
  const totalCount = data?.pages[0]?.count || 0;

  // Loading state for initial load
  if (isLoading) {
    return (
      <>
        <RouteBox items={route} routlength={route.length} />
        <div className="p-4 sm:p-6 lg:p-8 font-inter flex flex-col items-center">
          <div
            className="w-full bg-white rounded-lg shadow-xl p-6"
            dir={direction}
          >
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-4 text-gray-600">
                {t("Loading customers...")}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (isError) {
    return (
      <>
        <RouteBox items={route} routlength={route.length} />
        <div className="p-4 sm:p-6 lg:p-8 font-inter flex flex-col items-center">
          <div
            className="w-full bg-white rounded-lg shadow-xl p-6"
            dir={direction}
          >
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="text-red-500 text-xl mb-2">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {t("Error Loading Customers")}
                </h3>
                <p className="text-gray-600">
                  {error instanceof Error
                    ? error.message
                    : t("Failed to load customer data")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <RouteBox items={route} routlength={route.length} />
      <div className="p-4 sm:p-6 lg:p-8 font-inter flex flex-col items-center">
        <div
          className="w-full bg-white rounded-lg shadow-xl p-6 print:rounded-none print:shadow-none print:p-0 print:border-1 print:border-gray-300"
          dir={direction}
          ref={contentRef}
        >
          <h1 className="text-3xl sm:text-4xl print:text-xl font-bold text-gray-800 m-2 text-center">
            {t("Customers Report")}
          </h1>

          {/* Summary and Filter Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600 print:hidden">
              {t("Showing")} {filteredCustomers.length} {t("of")} {totalCount}{" "}
              {t("Customers")}
              {filterType !== "all" && ` (${filterType} balances only)`}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleFilterChange}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out print:hidden"
              >
                {getFilterButtonText()}
              </button>
              <button
                className="bg-orange-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow print:hidden"
                title="Download PDF"
                onClick={reactToPrintFn}
              >
                <Printer className="inline" /> {t("Print")}
              </button>
            </div>
          </div>

          {/* Infinite Scroll Container */}
          <div className="overflow-auto w-96 md:w-full print:w-full">
            <InfiniteScroll
              dataLength={filteredCustomers.length}
              next={fetchNextPage}
              hasMore={!!hasNextPage && filterType === "all"} // Only enable infinite scroll when showing all customers
              loader={
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">
                    {t("Loading more customers...")}
                  </span>
                </div>
              }
              endMessage={
                filteredCustomers.length > 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <b className="print:hidden">
                      {t("You have seen all customers!")}
                    </b>
                  </div>
                ) : null
              }
              className="rounded-lg shadow-md"
            >
              <table className="print:text-sm w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 print:text-sm">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 print:px-2 print:py-1 whitespace-nowrap  text-center text-xs  text-gray-500 uppercase tracking-wider rounded-tl-lg"
                    >
                      {t("Customer ID")}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 print:px-2 print:py-1 whitespace-nowrap  text-center text-xs  text-gray-500 uppercase tracking-wider"
                    >
                      {t("Name")}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 print:px-2 print:py-1 whitespace-nowrap  text-center text-xs  text-gray-500 uppercase tracking-wider"
                    >
                      {t("Phone")}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 print:px-2 print:py-1 whitespace-nowrap  text-center text-xs  text-gray-500 uppercase tracking-wider"
                    >
                      {t("Email")}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 print:px-2 print:py-1 whitespace-nowrap  text-center text-xs  text-gray-500 uppercase tracking-wider"
                    >
                      {t("Address")}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 print:px-1  print:py-1 whitespace-nowrap  text-center text-xs  text-gray-500 uppercase tracking-wider rounded-tr-lg"
                    >
                      {t("Balance")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 print:text-sm">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-4 print:py-1 print:px-2  whitespace-nowrap text-center text-sm text-gray-500"
                      >
                        {allCustomers.length === 0
                          ? t("No customers found.")
                          : t("No customers found for the current filter.")}
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => {
                      const balance = parseFloat(customer.balance);
                      return (
                        <tr key={customer.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 print:py-1 print:px-1 print:text-[12px] whitespace-nowrap text-center text-sm  text-gray-900">
                            {customer.customer_number}
                          </td>
                          <td className="px-4 py-4 print:py-1 print:px-1 print:text-[12px] whitespace-nowrap text-center text-sm text-gray-800">
                            {customer.name}
                          </td>
                          <td className="px-4 py-4 print:py-1 print:px-1 print:text-[12px] whitespace-nowrap text-center text-sm text-gray-800">
                            {customer.phone}
                          </td>
                          <td className="px-4 py-4 print:py-1 print:px-1 print:text-[12px] whitespace-nowrap text-center text-sm text-gray-800">
                            {customer.email}
                          </td>
                          <td className="px-4 py-4 print:py-1 print:px-1 print:text-[12px] whitespace-nowrap text-center text-sm text-gray-800">
                            {customer.address}
                          </td>
                          <td className="px-4 py-4 print:py-1 print:px-1 print:text-[12px] whitespace-nowrap text-center text-sm">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                balance > 0
                                  ? "bg-green-100 print:bg-white print:text-gray-800 text-green-800"
                                  : balance < 0
                                  ? "bg-red-100 print:bg-white print:text-gray-800 text-red-800"
                                  : "bg-gray-100 print:bg-white  text-gray-800"
                              }`}
                            >
                              {formatPriceWithCurrency(balance, 1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </InfiniteScroll>
          </div>

          {/* Show loading indicator when fetching next page */}
          {isFetchingNextPage && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">
                {t("Loading more...")}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
