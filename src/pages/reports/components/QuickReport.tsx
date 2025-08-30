import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCurrencyStore } from "../../../stores";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import RouteBox from "../../../components/RouteBox";
import { Spinner } from "../../../components/Loader";
import apiClient from "../../../lib/api";
import { formatLocalDateTime } from "../../../utils/formatLocalDateTime";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

// API Interfaces
interface DepartmentSale {
  department_id: number;
  department: string;
  total_quantity: string;
  total_sold: string;
  total_cost: string;
  total_profit: string;
}

export interface Transaction {
  id: number;
  description: string;
  amount: string;
  transaction_date: string;
}

interface CashDrawerAmount {
  id: number;
  currency: number;
  amount: string;
}

interface CashDrawer {
  id: number;
  name: string;
  description: string;
  location: number;
  amounts: CashDrawerAmount[];
}

interface SalesSummary {
  revenue: number;
  cost: number;
  profit: number;
  net_profit: number;
}

interface ApiResponse {
  department_sales: DepartmentSale[];
  transactions: Transaction[];
  cash_drawers: CashDrawer[];
  sales_summary: SalesSummary;
}

// Fetch function
const fetchQuickReportSummary = async (
  filter: string,
  startDate?: string,
  endDate?: string
): Promise<ApiResponse> => {
  const params: Record<string, string> = { filter };

  if (filter === "date_range" && startDate && endDate) {
    params.start_date = startDate;
    params.end_date = endDate;
  }

  const response = await apiClient.get("/finance/quick-reports/summary/", {
    params,
  });
  return response.data;
};

// Department Report Component
function DepartmentReport({ data }: { data: DepartmentSale[] }) {
  const { t } = useTranslation();
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        {t("Department Report")}
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-start">{t("Department Name")}</th>
              <th className="py-3 px-6 text-start">{t("Total Sold")}</th>
              <th className="py-3 px-6 text-start">{t("Total Cost")}</th>
              <th className="py-3 px-6 text-start">{t("Profit")}</th>
              <th className="py-3 px-6 text-start">{t("Quantity")}</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {data.map((dept) => (
              <tr
                key={dept.department_id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-6 text-start whitespace-nowrap">
                  {dept.department}
                </td>
                <td className="py-3 px-6 text-start">
                  {formatPriceWithCurrency(parseFloat(dept.total_sold), 1)}
                </td>
                <td className="py-3 px-6 text-start">
                  {formatPriceWithCurrency(parseFloat(dept.total_cost), 1)}
                </td>
                <td className="py-3 px-6 text-start">
                  {formatPriceWithCurrency(parseFloat(dept.total_profit), 1)}
                </td>
                <td className="py-3 px-6 text-start">
                  {parseFloat(dept.total_quantity).toFixed(0)} {t("items")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Resources Report Component
function ResourcesReport({ data }: { data: CashDrawer[] }) {
  const { t } = useTranslation();
  const CustomTooltip = (props: {
    active?: boolean;
    payload?: { value: string }[];
    label?: string;
  }) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-gray-800 text-white rounded-lg shadow-lg">
          <p className="text-sm font-semibold">{`${label}: ${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  const getCurrency = useCurrencyStore((s) => s.getCurrency);
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        {t("Resources Report")}
      </h3>
      {data.map((cashDrawer) => (
        <div
          key={cashDrawer.id}
          className="my-6 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-inter"
        >
          <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-500 to-blue-700 p-6 text-white text-center rounded-t-xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {cashDrawer.name} {t("Overview")}
              </h1>
              <p className="text-lg mt-2 opacity-90">
                {cashDrawer.description}
              </p>
            </div>

            {/* Content Section */}
            <div className="p-6 sm:p-8 lg:p-10 space-y-8 bg-blue-200">
              {/* USD Amount and Graph */}
              <div className="bg-blue-50 p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                {cashDrawer.amounts.map((amount) => (
                  <div
                    key={amount.id}
                    className="flex-shrink-0 border border-gray-200 bg-sky-100 p-3 rounded-md text-center md:text-start"
                  >
                    <h2 className="text-xl font-bold text-gray-500 mb-2">
                      {t("Amount")}{" "}
                      <span className="text-gray-600">
                        {getCurrency(amount.currency).code}
                      </span>
                    </h2>
                    <p className="text-2xl font-bold text-blue-500">
                      {formatPriceWithCurrency(
                        parseFloat(amount.amount),
                        amount.currency
                      )}
                    </p>
                  </div>
                ))}
                <div className="w-full md:w-2/3 h-48 md:h-56 bg-sky-100 rounded-lg shadow-inner p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={cashDrawer.amounts.map((amount) => ({
                        name: getCurrency(amount.currency).code,
                        value: parseFloat(amount.amount),
                      }))}
                      margin={{ top: 10, right: 10, left: 20, bottom: 10 }}
                    >
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        className="text-sm text-gray-600"
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        className="text-sm text-gray-600"
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "rgba(0,0,0,0.1)" }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#4F46E5"
                        barSize={50}
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Transaction Report Component
function TransactionReport({ data }: { data: Transaction[] }) {
  const { t } = useTranslation();
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        {t("Transaction Report")}
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-start">{t("ID")}</th>
              <th className="py-3 px-6 text-start">{t("Description")}</th>
              <th className="py-3 px-6 text-start">{t("Amount")}</th>
              <th className="py-3 px-6 text-start">{t("Date")}</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {data.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-6 text-start">{transaction.id}</td>
                <td className="py-3 px-6 text-start">
                  {transaction.description || "N/A"}
                </td>
                <td className="py-3 px-6 text-start">
                  {formatPriceWithCurrency(parseFloat(transaction.amount), 1)}
                </td>
                <td className="py-3 px-6 text-start">
                  {formatLocalDateTime(transaction.transaction_date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Summary Box Component
function SummaryBox({ data }: { data: SalesSummary }) {
  const { t } = useTranslation();
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        {t("Sales Summary")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-gray-700">
        <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg shadow-sm">
          <span className="text-md font-medium text-blue-700 mb-3">
            {t("Revenue")}
          </span>
          <span className="text-2xl font-bold text-blue-900">
            {formatPriceWithCurrency(data.revenue, 1)}
          </span>
        </div>
        <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg shadow-sm">
          <span className="text-md font-medium text-red-700 mb-3">
            {t("Cost")}
          </span>
          <span className="text-2xl font-bold text-red-900">
            {formatPriceWithCurrency(data.cost, 1)}
          </span>
        </div>
        <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg shadow-sm">
          <span className="text-md font-medium text-green-700 mb-3">
            {t("Profit")}
          </span>
          <span className="text-2xl font-bold text-green-900">
            {formatPriceWithCurrency(data.profit, 1)}
          </span>
        </div>
        <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg shadow-sm">
          <span className="text-md font-medium text-purple-700 mb-3">
            {t("Net Profit")}
          </span>
          <span className="text-2xl font-bold text-purple-900">
            {formatPriceWithCurrency(data.net_profit, 1)}
          </span>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function QuickReport() {
  const [activeTab, setActiveTab] = useState<"today" | "yesterday" | "custom">(
    "today"
  );
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // Set initial dates for custom range to today and yesterday for convenience
  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    setFromDate(formatDate(yesterday));
    setToDate(formatDate(today));
  }, []);

  // Determine filter and dates for API call
  const getFilterParams = () => {
    if (activeTab === "today") {
      return { filter: "today" };
    } else if (activeTab === "yesterday") {
      return { filter: "yesterday" };
    } else {
      return {
        filter: "date_range",
        startDate: fromDate,
        endDate: toDate,
      };
    }
  };

  const { filter, startDate, endDate } = getFilterParams();

  // React Query
  const {
    data: reportData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["quick-report-summary", filter, startDate, endDate],
    queryFn: () => fetchQuickReportSummary(filter, startDate, endDate),
    enabled: activeTab !== "custom" || (!!fromDate && !!toDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
  const { t } = useTranslation();
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate || !toDate) {
      toast.error(t("Please select both start and end dates"));
      return;
    }
    setActiveTab("custom");
  };

  const handleTabChange = (tab: "today" | "yesterday" | "custom") => {
    setActiveTab(tab);
  };

  const routebox = [
    { path: "/reports", name: t("Reports") },
    { path: "", name: t("Quick Report") },
  ];

  if (error) {
    return (
      <>
        <RouteBox items={routebox} routlength={routebox.length} />
        <div className="mt-[-15px] bg-gradient-to-br from-blue-100 to-purple-100 font-sans text-gray-900 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center py-12">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t(" Failed to Load Report")}
              </h2>
              <p className="text-gray-600 mb-6">
                {t("There was an error loading the report data.")}
              </p>
              <button
                onClick={() => refetch()}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t("Try Again")}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <RouteBox items={routebox} routlength={routebox.length} />
      <div className="mt-[-15px] bg-gradient-to-br from-blue-100 to-purple-100 font-sans text-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="bg-gray-100 rounded-lg flex flex-wrap justify-center gap-6 mb-4">
            <h1 className="text-3xl font-extrabold text-center text-gray-900 mt-6">
              {t("Quick Report")}
            </h1>
            <button
              onClick={() => handleTabChange("today")}
              className={`px-6 h-13 mt-4 rounded-full text-lg font-medium transition-all duration-300 ease-in-out
              ${
                activeTab === "today"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {t("Today Report")}
            </button>
            <button
              onClick={() => handleTabChange("yesterday")}
              className={`px-6 h-13 mt-4 rounded-full text-lg font-medium transition-all duration-300 ease-in-out
              ${
                activeTab === "yesterday"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {t("Yesterday Report")}
            </button>
            {/* Date Range Input */}
            <div className="p-2">
              <form
                onSubmit={handleCustomSubmit}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <div className="flex flex-col w-full sm:w-auto">
                  <label
                    htmlFor="fromDate"
                    className="text-sm font-medium text-gray-600 mb-1"
                  >
                    {t("From Date")}:
                  </label>
                  <input
                    type="date"
                    id="fromDate"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 w-full"
                  />
                </div>
                <div className="flex flex-col w-full sm:w-auto">
                  <label
                    htmlFor="toDate"
                    className="text-sm font-medium text-gray-600 mb-1"
                  >
                    {t("To Date")}:
                  </label>
                  <input
                    type="date"
                    id="toDate"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 w-full"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-4 sm:mt-0 px-8 py-3 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 ease-in-out w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? t("Loading...") : t("Report")}
                </button>
              </form>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Spinner />
              <span className="ml-3 text-gray-600">
                {t("Loading report data...")}
              </span>
            </div>
          )}

          {/* Display Report based on active tab */}
          {!isLoading && reportData ? (
            <div className="space-y-6">
              <DepartmentReport data={reportData.department_sales} />
              <ResourcesReport data={reportData.cash_drawers} />
              <TransactionReport data={reportData.transactions} />
              <SummaryBox data={reportData.sales_summary} />
            </div>
          ) : (
            !isLoading && (
              <p className="text-center text-gray-600 text-lg">
                {t("Select a report tab or custom date range to view data.")}
              </p>
            )
          )}
        </div>
      </div>
    </>
  );
}
