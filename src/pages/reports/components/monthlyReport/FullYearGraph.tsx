import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
  Area,
  LineChart,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../lib/api";
import RouteBox from "../../../../components/RouteBox";
import { useParams } from "react-router-dom";
import { useCurrencyStore } from "../../../../stores";
import { useTranslation } from "react-i18next";

// Types for the API response
interface FinancialDataItem {
  month: string;
  sales: string;
  expense: string;
  cost: string;
  profit: string;
  netProfit: string;
}

interface TransformedDataItem {
  name: string;
  sales: number;
  expense: number;
  cost: number;
  profit: number;
  netProfit: number;
}

// Transform API data to chart format
const transformFinancialData = (
  data: FinancialDataItem[]
): TransformedDataItem[] => {
  return data.map((item) => ({
    name: item.month,
    sales: parseFloat(item.sales) || 0,
    expense: parseFloat(item.expense) || 0,
    cost: parseFloat(item.cost) || 0,
    profit: parseFloat(item.profit) || 0,
    netProfit: parseFloat(item.netProfit) || 0,
  }));
};

// Enhanced Custom Tooltip component with glassmorphism effect
const CustomFinancialTooltip = (props: {
  active?: boolean;
  payload?: { value: number | string; name: string; color: string }[];
  label?: string;
}) => {
  const { active, payload, label } = props;
  const currency_id = useCurrencyStore((s) => s.getBaseCurrency().id);
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-blur-lg bg-white/90 border border-white/20 rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <p className="text-sm font-bold text-gray-800">{label}</p>
        </div>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div
              key={`item-${index}`}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-xs font-medium text-gray-700">
                  {entry.name}
                </span>
              </div>
              <span
                className="text-sm font-bold"
                style={{ color: entry.color }}
              >
                {formatPriceWithCurrency(Number(entry.value), currency_id)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Enhanced Loading component with animated skeleton
const LoadingSpinner = () => (
  <div className="h-[500px] space-y-6 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-32"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
    </div>
    <div className="space-y-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex-1"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
        </div>
      ))}
    </div>
  </div>
);

// Enhanced Error component with better design
function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-[500px] text-center">
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-8 max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {t("Oops! Something went wrong")}
        </h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transform transition-all duration-200 hover:scale-105 shadow-lg"
        >
          {t("Try Again")}
        </button>
      </div>
    </div>
  );
}
// Enhanced No Data component
function NoDataMessage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-[500px] text-center">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {t("No Data Available")}
        </h3>
        <p className="text-sm text-gray-600">
          {t("Financial data for this year is not available yet.")}
        </p>
      </div>
    </div>
  );
}
// Main Financial Reports Graph Component
export default function FinancialGraph() {
  const currency_id = useCurrencyStore((s) => s.getBaseCurrency().id);
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  const { t } = useTranslation();
  // Get year from URL params
  const { year } = useParams<{ year?: string }>();
  const selectedYear = year || new Date().getFullYear().toString();

  const route = [
    { name: t("Reports"), path: "/reports" },
    { name: t("Monthly Report"), path: "/reports/monthlyReport" },
    { name: t("Full Year Report"), path: "" },
  ];

  // API function to fetch yearly financial data - moved inside component to access year
  const fetchYearlyFinancialData = async (): Promise<FinancialDataItem[]> => {
    const response = await apiClient.get(
      `/finance/yearly-reports/yearly-report/?year=${selectedYear}`
    );
    return response.data;
  };

  // React Query hook to fetch financial data
  const {
    data: rawFinancialData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["yearlyFinancialReport", selectedYear],
    queryFn: fetchYearlyFinancialData,
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Transform the data for the chart
  const financialData = rawFinancialData
    ? transformFinancialData(rawFinancialData)
    : [];

  // Find the month with the highest net profit to highlight it
  const maxNetProfitMonth =
    financialData.length > 0
      ? financialData.reduce((prev, current) =>
          prev.netProfit > current.netProfit ? prev : current
        )
      : null;

  // Render loading state
  if (isLoading) {
    return (
      <>
        <RouteBox items={route} routlength={route.length} />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 mt-[-15px]">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {t("Full Year Financial Report")}
                  </h2>
                  <p className="text-gray-500 mt-2">
                    {t("Loading your financial insights...")}
                  </p>
                </div>
                <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30">
                  <span className="text-sm font-bold text-gray-700">
                    {selectedYear}
                  </span>
                </div>
              </div>
              <LoadingSpinner />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Render error state
  if (isError) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : t("Failed to load financial data");

    return (
      <>
        <RouteBox items={route} routlength={route.length} />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 mt-[-15px]">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {t("Full Year Financial Report")}
                </h2>
                <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30">
                  <span className="text-sm font-bold text-gray-700">
                    {selectedYear}
                  </span>
                </div>
              </div>
              <ErrorMessage message={errorMessage} onRetry={() => refetch()} />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Render no data state
  if (!financialData.length) {
    return (
      <>
        <RouteBox items={route} routlength={route.length} />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 mt-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {t("Full Year Financial Report")}
                  </h2>
                  <p className="text-gray-500 mt-2">
                    {t(
                      "Detailed monthly breakdown of sales, expenses, costs, and profits."
                    )}
                  </p>
                </div>
                <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30">
                  <span className="text-sm font-bold text-gray-700">
                    {selectedYear}
                  </span>
                </div>
              </div>
              <NoDataMessage />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <RouteBox items={route} routlength={route.length} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 mt-[-15px]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500 hover:shadow-3xl">
            {/* Enhanced Graph Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                  {t("Full Year Financial Report")}
                </h2>
                <p className="text-gray-500 font-medium">
                  {t(
                    "Comprehensive monthly analysis of your financial performance"
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30">
                  <span className="text-sm font-bold text-white bg-blue-500 p-2 rounded-md ">
                    {selectedYear}
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="bg-green-500 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: t("Total Sales"),
                  value: financialData.reduce(
                    (sum, item) => sum + item.sales,
                    0
                  ),
                  color: "from-blue-500 to-blue-600",
                },
                {
                  label: t("Total Expenses"),
                  value: financialData.reduce(
                    (sum, item) => sum + item.expense,
                    0
                  ),
                  color: "from-red-500 to-red-600",
                },
                {
                  label: t("Total Profit"),
                  value: financialData.reduce(
                    (sum, item) => sum + item.profit,
                    0
                  ),
                  color: "from-green-500 to-green-600",
                },
                {
                  label: t("Net Profit"),
                  value: financialData.reduce(
                    (sum, item) => sum + item.netProfit,
                    0
                  ),
                  color: "from-purple-500 to-purple-600",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30 hover:bg-white/80 transition-all duration-300"
                >
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-r ${stat.color} mb-2 flex items-center justify-center`}
                  >
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {formatPriceWithCurrency(stat.value, currency_id)}
                  </p>
                </div>
              ))}
            </div>

            {/* Enhanced Chart Area */}
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <div className="h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={financialData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorSales"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                      <linearGradient
                        id="gradientExpense"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#ef4444"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="100%"
                          stopColor="#ef4444"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="2 4"
                      vertical={false}
                      stroke="#e2e8f0"
                      opacity={0.6}
                    />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                      padding={{ left: 20, right: 20 }}
                      tick={{
                        fill: "#64748b",
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        `$${(value / 1000).toFixed(0)}k`
                      }
                      tickLine={false}
                      axisLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                      domain={[0, "auto"]}
                      tick={{
                        fill: "#64748b",
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    />
                    <Tooltip
                      cursor={{
                        stroke: "#dbeafe",
                        strokeWidth: 2,
                        strokeDasharray: "4 4",
                      }}
                      content={<CustomFinancialTooltip />}
                    />
                    <Legend
                      verticalAlign="top"
                      height={50}
                      wrapperStyle={{
                        paddingTop: "10px",
                        paddingBottom: "20px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    />

                    {/* Area for Total Sales with enhanced gradient */}
                    <Area
                      type="monotone"
                      dataKey="sales"
                      name={t("Total Sales")}
                      stroke="#3b82f6"
                      fill="url(#colorSales)"
                      strokeWidth={4}
                      isAnimationActive={true}
                      animationDuration={2000}
                    />

                    {/* Enhanced Lines with better styling */}
                    <Line
                      type="monotone"
                      dataKey="expense"
                      name={t("Total Expenses")}
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={{
                        r: 5,
                        fill: "#ef4444",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{
                        r: 8,
                        stroke: "#ef4444",
                        strokeWidth: 3,
                        fill: "#fff",
                      }}
                      isAnimationActive={true}
                      animationDuration={2000}
                    />
                    <Line
                      type="monotone"
                      dataKey="cost"
                      name={t("Total Cost")}
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{
                        r: 5,
                        fill: "#f97316",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{
                        r: 8,
                        stroke: "#f97316",
                        strokeWidth: 3,
                        fill: "#fff",
                      }}
                      isAnimationActive={true}
                      animationDuration={2000}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      name={t("Total Profit")}
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{
                        r: 5,
                        fill: "#10b981",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{
                        r: 8,
                        stroke: "#10b981",
                        strokeWidth: 3,
                        fill: "#fff",
                      }}
                      isAnimationActive={true}
                      animationDuration={2000}
                    />
                    <Line
                      type="monotone"
                      dataKey="netProfit"
                      name={t("Net Profit")}
                      stroke="#8b5cf6"
                      strokeWidth={4}
                      dot={{
                        r: 6,
                        fill: "#8b5cf6",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{
                        r: 9,
                        stroke: "#8b5cf6",
                        strokeWidth: 3,
                        fill: "#fff",
                      }}
                      isAnimationActive={true}
                      animationDuration={2000}
                    />

                    {/* Enhanced Reference area with gradient */}
                    {maxNetProfitMonth && (
                      <ReferenceArea
                        x1={maxNetProfitMonth.name}
                        x2={maxNetProfitMonth.name}
                        fill="url(#gradientHighlight)"
                        fillOpacity={0.1}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Best Performing Month Highlight */}
            {maxNetProfitMonth && (
              <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-800">
                      {t("Best Performing Month")}
                    </h4>
                    <p className="text-sm text-green-700">
                      <span className="font-semibold">
                        {maxNetProfitMonth.name}
                      </span>{" "}
                      {t("achieved the highest net profit of")}{" "}
                      <span className="font-bold">
                        {formatPriceWithCurrency(
                          maxNetProfitMonth.netProfit,
                          currency_id
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
