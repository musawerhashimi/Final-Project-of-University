import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../lib/api";
import { useCurrencyStore } from "../../../stores";
import RouteBox from "../../../components/RouteBox";
import { useReactToPrint } from "react-to-print";
import { useDirection } from "../../../hooks/useDirection";
import { useTranslation } from "react-i18next";
import { Printer } from "lucide-react";

// Transaction interface
interface Transaction {
  id: number;
  description: string;
  amount: string;
  transaction_date: string;
  party_type: string;
  reference_type: string;
  currency: number;
  transaction_type: string;
  cash_drawer_name: string;
  created_by_name: string;
}

// Loading spinner component
function LoadingSpinner() {
  const { t } = useTranslation();
  return (
    <div className=" flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
        {t("Loading transactions...")}
      </span>
    </div>
  );
}
// Error component
function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="text-red-600 text-lg mb-4">
        {t("Error")}: {message}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t("Retry")}
        </button>
      )}
    </div>
  );
}
// Status badge component
function StatusBadge({ type }: { type: string }) {
  const getStatusStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case "income":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 print:bg-transparent  print:text-[12px]";
      case "expense":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 print:bg-transparent  print:text-[12px]";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 print:bg-transparent  print:text-[12px]";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(
        type
      )}`}
    >
      {type}
    </span>
  );
}

// Main transactions table component
export default function TransactionsReport() {
  const { t } = useTranslation();
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

  const { formatPriceWithCurrency } = useCurrencyStore();

  const { data, isLoading, isError, error, refetch } = useQuery<
    Transaction[],
    Error
  >({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await apiClient.get("/finance/transactions");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className=" mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
          <ErrorMessage
            message={error?.message || "Failed to fetch transactions"}
            onRetry={refetch}
          />
        </div>
      </div>
    );
  }
  const route = [
    { name: t("Reports"), path: "/reports" },
    { name: t("Transactions Report"), path: "" },
  ];

  return (
    <>
      <RouteBox items={route} routlength={route.length} />
      <div className="p-4 sm:p-6 lg:p-8 dark:bg-gray-900 min-h-screen ">
        <div
          dir={direction}
          ref={contentRef}
          className=" mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="print:bg-transparent print:p-2 px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold leading-tight text-white">
                  {t("Transactions Report")}
                </h2>
                <p className="mt-1 text-sm text-blue-100">
                  {t("A detailed overview of all transactions")} (
                  {data?.length || 0} {t("records")})
                </p>
              </div>
              <button
                title="Download PDF"
                onClick={reactToPrintFn}
                className="print:hidden px-4 py-2 bg-orange-600 hover:bg-white/30 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                <Printer className="inline" /> {t("Print")}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto w-96 md:w-full print:w-full rounded-lg shadow-md">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="print:px-1 print:py-2   px-4 py-3 sm:px-6 text-center whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("ID")}
                  </th>
                  <th className="print:px-1 print:py-2   px-4 py-3 sm:px-6 text-center whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("Transaction Category")}
                  </th>
                  <th className="print:px-1 print:py-2   px-4 py-3 sm:px-6 text-center whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("Amount")}
                  </th>
                  <th className="print:px-1 print:py-2   px-4 py-3 sm:px-6 text-center whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("Type")}
                  </th>
                  <th className="print:px-1 print:py-2   px-4 py-3 sm:px-6 text-center whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("Date")}
                  </th>
                  <th className="print:px-1 print:py-2   px-4 py-3 sm:px-6 text-center whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("Reference")}
                  </th>
                  <th className="print:px-1 print:py-2   px-4 py-3 sm:px-6 text-center whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("Resources")}
                  </th>
                  <th className="print:px-1 print:py-2   px-4 py-3 sm:px-6 text-center whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("Created By")}
                  </th>
                  <th className="print:px-1 print:py-2   px-4 py-3 sm:px-6 text-center whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("Description")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data?.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50 dark:bg-gray-750"
                    }`}
                  >
                    <td className="print:p-1 print:text-[12px] text-center px-4 py-4 sm:px-6 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      #{transaction.id}
                    </td>
                    <td className="print:p-1 print:text-[12px] text-center px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 capitalize">
                      {transaction.party_type}
                    </td>

                    <td className="print:p-1 print:text-[12px] text-center px-4 py-4 sm:px-6 whitespace-nowrap text-sm font-semibold">
                      <span
                        className={
                          transaction.transaction_type === "income"
                            ? "text-green-600 print:text-[12px] dark:text-green-400"
                            : "text-red-600 print:text-[12px] dark:text-red-400"
                        }
                      >
                        {formatPriceWithCurrency(
                          parseFloat(transaction.amount),
                          transaction.currency
                        )}
                      </span>
                    </td>
                    <td className="print:p-1 print:text-[12px] text-center px-4 py-4 sm:px-6 whitespace-nowrap">
                      <StatusBadge type={transaction.transaction_type} />
                    </td>
                    <td className="print:p-1 print:text-[12px] text-center px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {new Date(
                        transaction.transaction_date
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="print:p-1 print:text-[12px] text-center px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 capitalize">
                      {transaction.reference_type}
                    </td>
                    <td className="print:p-1 print:text-[12px] text-center px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {transaction.cash_drawer_name}
                    </td>
                    <td className="print:p-1 print:text-[12px] text-center px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {transaction.created_by_name}
                    </td>
                    <td className="print:p-1 print:text-[12px] text-center px-4 py-4 sm:px-6 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      <div title={transaction.description}>
                        {transaction.description}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {data && data.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-gray-500 dark:text-gray-400 text-lg">
                {t("No transactions found")}
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                {t("Transactions will appear here when they are created")}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
