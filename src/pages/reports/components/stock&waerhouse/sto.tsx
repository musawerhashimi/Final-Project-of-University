import { useState, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";

import apiClient from "../../../../lib/api";
import RouteBox from "../../../../components/RouteBox";
import { useLocationStore } from "../../../../stores";
import { useReactToPrint } from "react-to-print";
import { useDirection } from "../../../../hooks/useDirection";
import { useTranslation } from "react-i18next";
import { Printer } from "lucide-react";

interface InventoryItem {
  id: number;
  item: string;
  barcode: string;
  department_name: string;
  category_name: string;
  available_quantity: number;
  sold_quantity: number;
}

interface InventoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: InventoryItem[];
}

interface InventoryTableProps {
  location_id: number;
}

function InventoryTable({ location_id }: InventoryTableProps) {
  const { t } = useTranslation();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const loacations = useLocationStore((s) => s.locations);
  const location = loacations.find((loc) => loc.id === location_id);
  const {
    data,
    fetchNextPage,
    hasNextPage,

    isLoading,
    error,
  } = useInfiniteQuery<InventoryResponse>({
    queryKey: ["inventory", location_id],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get<InventoryResponse>(
        `/inventory/variant-inventory/?page=${pageParam}&location_id=${location_id}`
      );
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        return url.searchParams.get("page");
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // Flatten all pages data
  const allItems = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) || [];
  }, [data]);

  // Get unique departments and categories for filters
  const departments = useMemo(() => {
    const uniqueDepts = [
      ...new Set(allItems.map((item) => item.department_name)),
    ];
    return uniqueDepts.sort();
  }, [allItems]);

  const categories = useMemo(() => {
    const uniqueCats = [...new Set(allItems.map((item) => item.category_name))];
    return uniqueCats.sort();
  }, [allItems]);

  // Filter items based on selected filters
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const deptMatch =
        !selectedDepartment || item.department_name === selectedDepartment;
      const catMatch =
        !selectedCategory || item.category_name === selectedCategory;
      return deptMatch && catMatch;
    });
  }, [allItems, selectedDepartment, selectedCategory]);

  const totalCount = data?.pages[0]?.count || 0;
  const route = [
    { name: t("Reports"), path: "/reports" },
    {
      name: t("Store & Warehouse Report"),
      path: "/reports/StockWarehouseReport",
    },
    {
      name: `${location?.name}`,
      path: "",
    },
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
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 bg-gray-50 min-h-screen rounded-lg shadow-inner">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-indigo-500"></div>
        <span className="ml-4 text-lg font-medium text-gray-700">
          {t("Loading inventory...")}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative shadow-md m-4">
        <strong className="font-bold">{t("Error")}!</strong>
        <span className="block sm:inline ml-2">
          {t("Error loading inventory data. Please try again.")}
        </span>
      </div>
    );
  }

  return (
    <>
      <RouteBox items={route} routlength={route.length} />
      <div className="mt-[-15px] p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen font-inter">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 p-4 bg-white rounded-xl shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">
            {location?.name} {location?.location_type}
            <span className="text-indigo-600">
              ({totalCount} {t("items")})
            </span>
          </h2>
          <button
            className="bg-orange-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow print:hidden"
            title="Download PDF"
            onClick={reactToPrintFn}
          >
            <Printer className="inline" /> {t("Print")}
          </button>
          {/* Potentially add actions here later */}
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {t("Filters")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label
                htmlFor="department-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("Department")}
              </label>
              <select
                id="department-select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out appearance-none bg-white bg-no-repeat bg-[length:1.5rem_1.5rem] bg-[right_0.75rem_center] bg-[url('data:image/svg+xml,%3csvg_xmlns=%27http://www.w3.org/2000/svg%27_viewBox=%270_0_16_16%27%3e%3cpath_fill=%27none%27_stroke=%27%23343a40%27_stroke-linecap=%27round%27_stroke-linejoin=%27round%27_stroke-width=%272%27_d=%27m2_5_6_6_6-6%27/%3e%3c/svg%3e')]"
              >
                <option value="">{t("All Departments")}</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="category-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("Category")}
              </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out appearance-none bg-white bg-no-repeat bg-[length:1.5rem_1.5rem] bg-[right_0.75rem_center] bg-[url('data:image/svg+xml,%3csvg_xmlns=%27http://www.w3.org/2000/svg%27_viewBox=%270_0_16_16%27%3e%3cpath_fill=%27none%27_stroke=%27%23343a40%27_stroke-linecap=%27round%27_stroke-linejoin=%27round%27_stroke-width=%272%27_d=%27m2_5_6_6_6-6%27/%3e%3c/svg%3e')]"
              >
                <option value="">{t("All Categories")}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-start md:justify-end">
              <button
                onClick={() => {
                  setSelectedDepartment("");
                  setSelectedCategory("");
                }}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105"
              >
                {t("Clear Filters")}
              </button>
            </div>
          </div>

          <div className="mt-5  text-gray-600 font-medium">
            {t("Showing")}{" "}
            <span className="font-semibold text-indigo-700">
              {filteredItems.length}
            </span>{" "}
            {t("of")}{" "}
            <span className="font-semibold text-indigo-700">
              {allItems.length}
            </span>{" "}
            {t("loaded items")}
          </div>
        </div>

        {/* Table */}
        <div
          className="mx-auto bg-white md:w-full w-100 print:w-full border border-gray-200 rounded-xl shadow-lg "
          dir={direction}
          ref={contentRef}
        >
          <InfiniteScroll
            dataLength={allItems.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={
              <div className="flex justify-center items-center p-6 border-t border-gray-200 bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                <span className="ml-3  text-gray-600">
                  {t("Loading more items...")}
                </span>
              </div>
            }
            endMessage={
              <div className="text-center p-6 border-t border-gray-200 bg-gray-50 text-gray-600 font-medium ">
                <p>
                  {t("All")}{" "}
                  <span className="font-semibold text-indigo-700">
                    {totalCount}
                  </span>{" "}
                  {t("items loaded.")}
                </p>
              </div>
            }
          >
            <h1 className="text-center text-2xl font-bold text-gray-800 mb-4 p-4 print:p-1 print:mb-1 bg-blue-50 rounded-t-lg shadow-sm">
              {location?.name} {location?.location_type} {t("Reports")}
            </h1>
            <table className=" w-full divide-y divide-gray-200">
              <thead className="bg-blue-500  shadow-sm ">
                <tr>
                  <th className="px-6 py-4 print:py-0 text-center whitespace-nowrap text-sm font-semibold text-white uppercase tracking-wider">
                    {t("Items")}
                  </th>
                  <th className="px-6 py-4 print:py-0 text-center whitespace-nowrap text-sm font-semibold text-white uppercase tracking-wider">
                    {t("Barcode")}
                  </th>
                  <th className="px-6 py-4 print:py-0 text-center whitespace-nowrap text-sm font-semibold text-white uppercase tracking-wider">
                    {t("Department")}
                  </th>
                  <th className="px-6 py-4 print:py-0 text-center whitespace-nowrap text-sm font-semibold text-white uppercase tracking-wider">
                    {t("Category")}
                  </th>
                  <th className="px-6 py-4 print:py-0 text-center whitespace-nowrap text-sm font-semibold text-white uppercase tracking-wider">
                    {t("Available")}
                  </th>
                  <th className="px-6 py-4 print:py-0 text-center whitespace-nowrap text-sm font-semibold text-white uppercase tracking-wider">
                    {t("Sold")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-indigo-50 hover:bg-opacity-20 transition duration-150 ease-in-out`}
                  >
                    <td className="px-6 py-4 print:py-0 text-center whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.item}
                    </td>
                    <td className="px-6 py-4 print:py-0 text-center whitespace-nowrap text-sm text-gray-600">
                      {item.barcode}
                    </td>
                    <td className="px-6 py-4 print:py-0 text-center whitespace-nowrap text-sm text-gray-600">
                      {item.department_name}
                    </td>
                    <td className="px-6 py-4 print:py-0 text-center whitespace-nowrap text-sm text-gray-600">
                      {item.category_name}
                    </td>
                    <td className="px-6 py-4 print:py-0 text-center whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-3 py-1 rounded-full print:rounded-none print:text-sm print:bg-transparent text-xs font-semibold bg-emerald-100 text-emerald-800 ">
                        {item.available_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 print:py-0 text-center whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800  print:rounded-none print:text-sm print:bg-transparent">
                        {item.sold_quantity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredItems.length === 0 && allItems.length > 0 && (
              <div className="text-center p-12 bg-gray-50">
                <p className="text-lg text-gray-500 font-medium">
                  {t(
                    "No items match the selected filters. Try clearing your filters!"
                  )}
                </p>
              </div>
            )}
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
}

export default InventoryTable;
