import { useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Chart from "chart.js/auto";
import apiClient from "../../../../../lib/api"; // Import our API client
import CircleAnimation from "../../../../../components/animation";
import { generateRandomColors } from "../../../../../utils/generateRandomColors";
import { useTranslation } from "react-i18next";
import { useCurrencyStore } from "../../../../../stores";

// Define the expected shape of the API response
interface VendorStat {
  name: string;
  total_quantity: number;
  total_amount: number;
}

interface ApiResponse {
  statistics: VendorStat[];
  total_amount: number;
}

// Define component props
interface VendorOverviewProps {
  vendorId: number;
}

// API fetching function
const fetchVendorStats = async (vendorId: number): Promise<ApiResponse> => {
  const { data } = await apiClient.get(`/vendors/vendors/${vendorId}/stats/`);
  return data;
};

// Main App component
function VendorOverview({ vendorId }: VendorOverviewProps) {
  const { t } = useTranslation();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const BaseCurrencyId = useCurrencyStore((s) => s.getBaseCurrency)().id;
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  const baseCurrencyName = useCurrencyStore((s) => s.getBaseCurrency)();
  // Fetch data using React Query
  const { data, isLoading, isError, error } = useQuery<ApiResponse, Error>({
    queryKey: ["vendorStats", vendorId], // Unique key for this query
    queryFn: () => fetchVendorStats(vendorId), // The function that will fetch the data
  });

  const chartData = useMemo(() => {
    if (!data) return { labels: [], costs: [], quantities: [], colors: [] };

    const labels = data.statistics.map((item) => item.name);
    const costs = data.statistics.map((item) => item.total_amount);
    const quantities = data.statistics.map((item) => item.total_quantity);
    const colors = generateRandomColors(labels.length);

    return { labels, costs, quantities, colors };
  }, [data]); // Re-run only when the data changes

  useEffect(() => {
    if (!chartRef.current || !data) return; // Don't render chart if canvas or data is not ready

    const ctx = chartRef.current.getContext("2d");
    if (ctx) {
      // Destroy the previous chart instance to prevent memory leaks
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create the new Bar Chart
      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartData.labels, // Use dynamic labels from API
          datasets: [
            {
              label: `${t("Total Cost")} ${baseCurrencyName.code}`,
              data: chartData.costs, // Use dynamic costs from API
              backgroundColor: chartData.colors, // Array of colors

              borderColor: chartData.colors.map((color) =>
                color.replace("0.8", "1")
              ), // Brighter border

              borderWidth: 1,
              borderRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.dataset.label || "";
                  const value = context.parsed.y;
                  return `${label}: ${formatPriceWithCurrency(
                    value,
                    BaseCurrencyId
                  )}`;
                },
              },
            },
          },
          scales: {
            y: {
              stacked: false,
              beginAtZero: true,
              title: {
                display: true,
                text: `${t("Total Cost")} ${baseCurrencyName.code}`,
              },
            },
            x: {
              stacked: false,
              title: {
                display: true,
                text: t("Product Name"),
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData, data]); // Re-run effect if chartData or full data object changes

  // Conditional rendering for loading and error states
  if (isLoading) {
    return <CircleAnimation />;
  }

  if (isError) {
    return (
      <div className="text-center p-8 text-red-600">
        {t("Error")}: {error.message} ❌
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-4">
      <div className="chart-container bg-white rounded-3xl shadow-xl p-8 w-full max-w-4xl flex flex-col items-center border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2 text-center">
          {t("Vendor Overview")}
        </h1>
        <h2 className="text-xl font-semibold text-gray-600 mb-8">
          {t("Total Spent")}:{" "}
          <span className="text-blue-500">
            {formatPriceWithCurrency(data?.total_amount ?? 0, BaseCurrencyId)}
          </span>
        </h2>
        <div className="w-full h-96">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
}

export default VendorOverview;
