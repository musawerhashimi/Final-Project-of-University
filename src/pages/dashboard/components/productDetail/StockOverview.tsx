import { useLocationStore, useCurrencyStore } from "../../../../stores";
import { useReactToPrint } from "react-to-print";
import { useRef, useState } from "react";
import { useDirection } from "../../../../hooks/useDirection";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../lib/api";
import { formatLocalDateTime } from "../../../../utils/formatLocalDateTime";
import { useTranslation } from "react-i18next";
import { Printer } from "lucide-react";

interface Props {
  productId: number;
}

export interface ProductStats {
  name: string;
  available: number;
  purchased: number;
  sold: number;
  returned: number;
  purchases: {
    purchase_id: number;
    cost_price: number;
    cost_currency: number;
    purchas_date: string;
    quantity: number;
    sale_price: number;
    sale_currency: number;
    vendor: string;
    added_by: string;
  }[];
}

function StockOverview({ productId }: Props) {
  const getStores = useLocationStore((s) => s.getStores);
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  const stores = getStores ? getStores() : [];
  const [selectedLocationId, setSelectedLocationId] = useState<number>(
    stores.length > 0 ? stores[0].id : 1
  );
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

  // Fetch product stats
  const {
    data: productStats,
    isLoading,
    error,
  } = useQuery<ProductStats>({
    queryKey: ["productStats", productId, selectedLocationId],
    queryFn: async () => {
      const response = await apiClient.get(
        `/catalog/products/${productId}/stats/?location_id=${selectedLocationId}`
      );
      return response.data;
    },
  });

  const handleLocationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLocationId(Number(event.target.value));
  };

  // Skeleton Component
  const ProductHistorySkeleton = () => (
    <div className="mb-8 relative">
      <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
      <div className="bg-blue-50 rounded-lg shadow-inner mx-auto">
        <div className="space-y-0">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex border-b border-blue-100 last:border-b-0"
            >
              <div className="p-3 print:p-1 w-1/2 bg-blue-50">
                <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="p-3 print:p-1 w-1/2 bg-green-50">
                <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PurchaseListSkeleton = () => (
    <div>
      <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-6 animate-pulse"></div>
      <div className="overflow-auto w-96 print:w-full md:w-full shadow-md rounded-lg">
        <div className="w-full">
          {/* Header skeleton */}
          <div className="bg-blue-100 rounded-t-lg">
            <div className="flex">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="px-6 py-3 flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
          {/* Body skeleton */}
          <div className="bg-white">
            {[1, 2, 3].map((row) => (
              <div
                key={row}
                className="flex border-b border-gray-300 last:border-b-0"
              >
                {[1, 2, 3, 4, 5, 6].map((col) => (
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

  const SkeletonLoader = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <ProductHistorySkeleton />
      <PurchaseListSkeleton />
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center py-8">
          <div className="text-red-500 text-lg font-semibold mb-2">
            {t("Error loading product data")}
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

  return (
    <div className="">
      {/* Stock Selection Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
        <label
          htmlFor="stock-select"
          className="block text-gray-700 text-lg font-semibold mb-3"
        >
          {t("Select Stock to see Overview")}
        </label>
        <select
          id="stock-select"
          value={selectedLocationId}
          onChange={handleLocationChange}
          className="w-full block p-3 print:p-1 border border-gray-300 bg-white rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition-all duration-200 ease-in-out text-gray-800
                       hover:border-blue-400"
        >
          {stores.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      {/* Loading state */}
      {isLoading && <SkeletonLoader />}

      {/* Product History and Purchase List Section */}
      {!isLoading && productStats && (
        <div
          dir={direction}
          ref={contentRef}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 print:border-0 print:shadow-none print:rounded-none"
        >
          {/* Product History Card */}
          <div className="mb-8 relative">
            <h1 className="text-center text-gray-800  md:text-3xl print:text-xl font-extrabold p-2 mb-2">
              {t("Product History in")}{" "}
              <span className="text-blue-500">
                {stores.find((s) => s.id === selectedLocationId)?.name ||
                  t("Stock")}
              </span>
            </h1>
            {/* PDF Button */}
            <button
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow print:hidden"
              title="Download PDF"
              onClick={reactToPrintFn}
            >
              <Printer className="inline" /> {t("Print")}
            </button>
            <div className="bg-blue-50 rounded-lg shadow-inner mx-auto">
              <table className="w-full text-gray-800 table-auto ">
                <tbody>
                  <tr className="border-b border-blue-100">
                    <th className="p-3 print:p-1 text-start font-medium bg-blue-50 w-1/2 rounded-tl-lg print:text-sm">
                      {t("Available")}
                    </th>
                    <td className="p-3 print:p-1 text-end font-semibold bg-green-50 rounded-tr-lg print:text-sm">
                      {productStats.available}
                    </td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <th className="p-3 print:p-1 text-start font-medium bg-blue-50 w-1/2 print:text-sm">
                      {t("Purchase")}
                    </th>
                    <td className="p-3 print:p-1 text-end font-semibold bg-green-50 print:text-sm">
                      {productStats.purchased}
                    </td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <th className="p-3 print:p-1 text-start font-medium bg-blue-50 w-1/2 print:text-sm">
                      {t("Sold")}
                    </th>
                    <td className="p-3 print:p-1 text-end font-semibold bg-green-50 print:text-sm">
                      {productStats.sold}
                    </td>
                  </tr>
                  <tr className="border-b border-blue-100 last:border-b-0">
                    <th className="p-3 print:p-1  text-start font-medium bg-blue-50 w-1/2 print:text-sm">
                      {t("Returned")}
                    </th>
                    <td className="p-3 print:p-1 text-end font-semibold bg-green-50 print:text-sm">
                      {productStats.returned}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Purchase List Card */}
          <div>
            <h1 className="p-2 text-3xl print:text-xl font-bold text-center mb-2 text-gray-800">
              {t("Purchase List of")}{" "}
              <span className="text-blue-500">{productStats.name}</span>
            </h1>
            {productStats.purchases.length > 0 ? (
              <div className="overflow-auto w-96 print:w-full md:w-full shadow-md rounded-lg">
                <table className="w-full text-sm   text-gray-700">
                  <thead className="text-sm  text-gray-700 uppercase bg-blue-100">
                    <tr>
                      <th scope="col" className="px-6 py-2  rounded-tl-lg">
                        {t("Quantity")}
                      </th>
                      <th scope="col" className="px-6 py-2">
                        {t("Real Cost")}
                      </th>
                      <th scope="col" className="px-6 py-2">
                        {t("Sale Price")}
                      </th>
                      <th scope="col" className="px-6 py-2">
                        {t("Vendor")}
                      </th>
                      <th scope="col" className="px-6 py-2">
                        {t("Date")}
                      </th>
                      <th scope="col" className="px-6 py-2 rounded-tr-lg">
                        {t("Added By")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productStats.purchases.map((item) => (
                      <tr
                        key={item.purchase_id}
                        className="bg-white border-b border-gray-300 hover:bg-gray-50"
                      >
                        <td className="px-6 py-2 print:px-2 text-center print:py-1 text-nowrap font-medium text-gray-900 whitespace-nowrap">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-2 print:px-2 text-center print:py-1 text-nowrap font-medium text-gray-900 whitespace-nowrap">
                          {formatPriceWithCurrency(
                            item.cost_price,
                            item.cost_currency
                          )}
                        </td>
                        <td className="px-6 py-2 print:px-2 text-center print:py-1 text-nowrap font-medium text-gray-900 whitespace-nowrap">
                          {formatPriceWithCurrency(
                            item.sale_price,
                            item.sale_currency
                          )}
                        </td>
                        <td className="px-6 py-2 print:px-2 text-center print:py-1 text-nowrap font-medium text-gray-900 whitespace-nowrap">
                          {item.vendor}
                        </td>
                        <td className="px-6 py-2 print:px-2 text-center print:py-1 text-nowrap font-medium text-gray-900 whitespace-nowrap">
                          {formatLocalDateTime(item.purchas_date)}
                        </td>
                        <td className="px-6 py-2 print:px-2 text-center print:py-1 text-nowrap font-medium text-gray-900 whitespace-nowrap">
                          {item.added_by}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t(
                  "No purchase records found for this product in the selected location."
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StockOverview;
