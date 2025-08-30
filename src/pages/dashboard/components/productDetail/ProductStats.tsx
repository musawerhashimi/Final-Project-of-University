import { useCurrencyStore } from "../../../../stores";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../lib/api";
import { formatLocalDateTime } from "../../../../utils/formatLocalDateTime";
import { useTranslation } from "react-i18next";

interface Props {
  productId: number;
}

interface TopCustomer {
  name: string;
  customer_id: number;
  customer_name: string;
  total_quantity: number;
  total_spent: number;
  currency: number;
  last_purchase_date: string;
}

function ProductStats({ productId }: Props) {
  const { t } = useTranslation();
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );

  // Fetch top customers data
  const {
    data: topCustomers,
    isLoading,
    error,
  } = useQuery<TopCustomer[]>({
    queryKey: ["topCustomers", productId],
    queryFn: async () => {
      const response = await apiClient.get(
        `/catalog/products/${productId}/top-customers/`
      );
      return response.data;
    },
  });

  // Get product name from the first customer record (since all records have the same product name)
  const productName =
    topCustomers && topCustomers.length > 0 ? topCustomers[0].name : "Product";

  // Skeleton Component
  const TopCustomersSkeleton = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-6 animate-pulse"></div>
      <div className="overflow-auto shadow-md rounded-lg">
        <div className="w-full">
          {/* Header skeleton */}
          <div className="bg-blue-100 rounded-t-lg">
            <div className="flex">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="px-6 py-3 flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
          {/* Body skeleton */}
          <div className="bg-white">
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="flex border-b border-gray-300 last:border-b-0"
              >
                {[1, 2, 3, 4].map((col) => (
                  <div key={col} className="px-6 py-4 flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center py-8">
          <div className="text-red-500 text-lg font-semibold mb-2">
            {t(" Error loading top customers data")}
          </div>
          <div className="text-gray-600">
            {error instanceof Error
              ? error.message
              : t("An unexpected error occurred")}
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return <TopCustomersSkeleton />;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h1 className="text-center text-gray-800 text-md md:text-3xl font-extrabold p-2 mb-6">
        {t("Top Customers for")}{" "}
        <span className="text-blue-500">{productName}</span>
      </h1>

      {topCustomers && topCustomers.length > 0 ? (
        <div className=" overflow-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-700 uppercase bg-blue-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-center rounded-tl-lg">
                  {t("Customer Name")}
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  {t("Quantity Purchased")}
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  {t("Total Spent")}
                </th>
                <th scope="col" className="px-6 py-3 text-center rounded-tr-lg">
                  {t("Last Purchase Date")}
                </th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer) => (
                <tr
                  key={customer.customer_id}
                  className="bg-white border-b border-gray-300 hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap">
                    {customer.customer_name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {customer.total_quantity}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-green-600">
                    {formatPriceWithCurrency(
                      customer.total_spent,
                      customer.currency
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {formatLocalDateTime(customer.last_purchase_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
            <div className="text-gray-400 text-5xl mb-4">👥</div>
            <div className="text-gray-600 text-lg font-medium mb-2">
              {t("No customers found")}
            </div>
            <div className="text-gray-500 text-sm">
              {t("This product hasn't been purchased by any customers yet.")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductStats;
