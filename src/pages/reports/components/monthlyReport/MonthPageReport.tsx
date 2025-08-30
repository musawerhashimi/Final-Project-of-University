import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import RouteBox from "../../../../components/RouteBox";
import { useParams } from "react-router-dom";
import { apiClient } from "../../../../lib/api";
import { useCurrencyStore } from "../../../../stores";
import { month_names } from "../../../../data/month_names";
import { useTranslation } from "react-i18next";

// Type definitions
interface DailyFinanceData {
  date: string;
  sales: string;
  expense: string;
  cost: string;
  profit: string;
  netProfit: string;
}

interface ProcessedDailyData {
  date: string;
  sales: number;
  expense: number;
  cost: number;
  profit: number;
  netProfit: number;
}

// Function to fetch monthly report data
const fetchMonthlyReport = async (
  year: string,
  month: string
): Promise<DailyFinanceData[]> => {
  const response = await apiClient.get(
    `/finance/reports/monthly-report/?year=${year}&month=${month}`
  );
  return response.data;
};

// Helper function to process string data to numbers
const processFinanceData = (data: DailyFinanceData[]): ProcessedDailyData[] => {
  return data.map((item) => ({
    date: item.date,
    sales: parseFloat(item.sales),
    expense: parseFloat(item.expense),
    cost: parseFloat(item.cost),
    profit: parseFloat(item.profit),
    netProfit: parseFloat(item.netProfit),
  }));
};

// Helper function to calculate total for a given key
const calculateTotal = (
  data: ProcessedDailyData[],
  key: keyof ProcessedDailyData
) => {
  return data.reduce((sum, item) => {
    const value = item[key];
    return sum + (typeof value === "number" ? value : 0);
  }, 0);
};

interface PayloadData {
  payload: {
    sales: number;
    expense: number;
    profit: number;
  };
}

// Custom Tooltip component for the chart
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: PayloadData[];
  label?: string;
}) => {
  const currency_id = useCurrencyStore((s) => s.getBaseCurrency().id);
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  const { t } = useTranslation();
  if (active && payload && payload.length) {
    const currentData = payload[0]?.payload;
    return (
      <div className="p-2 bg-white rounded-lg shadow-md border border-gray-200">
        <p className="text-sm font-semibold text-gray-800">Date: {label}</p>
        <p className="text-sm text-gray-700">
          {t("Sales")}:{" "}
          {formatPriceWithCurrency(currentData?.sales, currency_id)}
        </p>
        <p className="text-sm text-gray-700">
          {t("Expense")}:{" "}
          {formatPriceWithCurrency(currentData?.expense, currency_id)}
        </p>
        <p className="text-sm text-gray-700">
          {t("Profit")}:{" "}
          {formatPriceWithCurrency(currentData?.profit, currency_id)}
        </p>
      </div>
    );
  }
  return null;
};

// KPI Card Component
function KPICard({
  title,
  value,
  isPositiveTrend = true,
  isLoading = false,
}: {
  title: string;
  value: number;
  isPositiveTrend?: boolean;
  isLoading?: boolean;
}) {
  const currency_id = useCurrencyStore((s) => s.getBaseCurrency().id);
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  return (
    <div className="flex-1 bg-green-200 rounded-xl shadow-md p-4 flex flex-col items-center justify-center min-w-[150px]">
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold text-gray-800 mb-2">
            {formatPriceWithCurrency(value, currency_id)}
          </p>
          <div
            className={`flex items-center text-xs font-semibold ${
              isPositiveTrend ? "text-green-500" : "text-red-500"
            }`}
          ></div>
        </>
      )}
    </div>
  );
}

// Loading skeleton for the chart
const ChartSkeleton = () => (
  <div className="h-80 w-full animate-pulse">
    <div className="h-full bg-gray-200 rounded"></div>
  </div>
);

export default function MonthPageReport() {
  const { t } = useTranslation();
  const currency_id = useCurrencyStore((s) => s.getBaseCurrency().id);
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  const [highlightedDate] = useState("15");
  const { month = "1", year } = useParams<{ month: string; year: string }>();

  // React Query to fetch data
  const {
    data: rawData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["monthlyReport", year, month],
    queryFn: () => fetchMonthlyReport(year || "2025", month || "7"),
    enabled: !!year && !!month, // Only run query if year and month are available
  });

  // Process the data
  const processedData = rawData ? processFinanceData(rawData) : [];

  // Calculate totals for KPI cards
  const totalSales = calculateTotal(processedData, "sales");
  const totalExpense = calculateTotal(processedData, "expense");
  const totalCost = calculateTotal(processedData, "cost");
  const totalProfit = calculateTotal(processedData, "profit");
  const totalNetProfit = calculateTotal(processedData, "netProfit");

  // Find the highlighted date data
  const highlightedDateIndex = processedData.findIndex(
    (item) => item.date === highlightedDate
  );
  const startDate =
    highlightedDateIndex !== -1
      ? processedData[highlightedDateIndex].date
      : null;
  const endDate =
    highlightedDateIndex !== -1
      ? processedData[highlightedDateIndex].date
      : null;
  const route = [
    { name: t("Reports"), path: "/reports" },
    { name: t("Monthly Report"), path: "/reports/monthlyreport" },
    { name: month_names[Number(month)], path: "" },
  ];

  // Error state
  if (isError) {
    return (
      <>
        <RouteBox items={route} routlength={route.length} />
        <div className="flex items-center justify-center p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-red-800 font-semibold mb-2">
              {t("Error Loading Data")}
            </h3>
            <p className="text-red-600 text-sm">
              {error instanceof Error
                ? error.message
                : t("Failed to load monthly report data")}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              {t("Retry")}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <RouteBox items={route} routlength={route.length} />
      <div className="flex items-center justify-center p-4 ">
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium text-gray-700">
                {t("Monthly Report")}
              </span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                {month}/ {year}
              </span>
            </div>
          </div>

          {/* KPI Cards Section */}
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <KPICard
              title={t("Total Sales")}
              value={totalSales}
              isPositiveTrend={true}
              isLoading={isLoading}
            />
            <KPICard
              title={t("Total Expenses")}
              value={totalExpense}
              isPositiveTrend={false}
              isLoading={isLoading}
            />
            <KPICard
              title={t("Total Cost")}
              value={totalCost}
              isPositiveTrend={false}
              isLoading={isLoading}
            />
            <KPICard
              title={t("Total Profit")}
              value={totalProfit}
              isPositiveTrend={true}
              isLoading={isLoading}
            />
            <KPICard
              title={t("Net Profit")}
              value={totalNetProfit}
              isPositiveTrend={true}
              isLoading={isLoading}
            />
          </div>

          {/* Chart Area */}
          <div className="h-80 w-full">
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={processedData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e0e0e0"
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 20, right: 20 }}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(value: number) =>
                      formatPriceWithCurrency(value, currency_id)
                    }
                    tickLine={false}
                    axisLine={false}
                    domain={[0, "auto"]}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                    content={<CustomTooltip />}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: "#3b82f6",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#3b82f6",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                  {/* Reference Area for highlighting a specific date */}
                  {startDate && endDate && (
                    <ReferenceArea
                      x1={startDate}
                      x2={endDate}
                      fill="#eff6ff"
                      fillOpacity={0.6}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Highlighted Value Display */}
          {highlightedDate && !isLoading && (
            <div className="flex justify-center mt-4">
              <div className="relative bg-blue-500 text-white text-sm font-bold py-1 px-3 rounded-md shadow-lg">
                {t("Sales")}:{" "}
                {formatPriceWithCurrency(
                  processedData.find((item) => item.date === highlightedDate)
                    ?.sales || 0,
                  currency_id
                )}
                <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-blue-500"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
