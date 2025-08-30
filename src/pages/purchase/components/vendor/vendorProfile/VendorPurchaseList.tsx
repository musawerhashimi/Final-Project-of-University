import { Link, useParams } from "react-router-dom";
import { useVendorPurchases } from "../../../../../hooks/useVendorPurchases";
import { useCurrencyStore } from "../../../../../stores";
import { Eye } from "lucide-react";
import { Spinner } from "../../../../../components/Loader";
import { useTranslation } from "react-i18next";
import { formatLocalDateTime } from "../../../../../utils/formatLocalDateTime";

function VendorPurchaseList() {
  const { t } = useTranslation();
  const { id } = useParams();
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  const {
    data: purchaseList = [],
    isLoading,
    error,
  } = useVendorPurchases(Number(id)); // Fetch vendor purchases using the custom hook

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{t("Purchase List")}</h2>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <p className="text-center text-red-600">
          {t("Error")}: {error.message}
        </p>
      ) : (
        <div className="overflow-auto w-96 md:w-full">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t("#Id")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t("List Name")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t("Purchase Date")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t("Total Item")}
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t("Total Cost")}
                </th>

                <th
                  scope="col"
                  className=" px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t("Actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchaseList.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {item.purchase_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {formatLocalDateTime(item.purchase_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {item.total_items} {t("items")}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {formatPriceWithCurrency(
                      parseFloat(item.total_amount),
                      item.currency
                    )}
                  </td>
                  <td className=" text-center whitespace-nowrap  text-sm text-gray-500">
                    <Link
                      to={`/purchase/purchaseList/purchaseListDetails/${item.id}`}
                      className="flex-1 p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <button
                        title="Mark as Received"
                        onClick={() => console.log("View details")}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Eye className="w-4 h-4 mr-1" /> {t("View")}
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default VendorPurchaseList;
