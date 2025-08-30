import { Printer } from "lucide-react";
import Logo from "../../../../components/Logo";
import { useCurrencyStore } from "../../../../stores";
import { useSettingsStore } from "../../../../stores/useSettingsStore";
import { formatLocalDateTime } from "../../../../utils/formatLocalDateTime";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useDirection } from "../../../../hooks/useDirection";

interface PurchaseDetailItem {
  product_name: string;
  barcode: string;
  quantity: string;
  unit_cost: string;
  line_total: string;
  currency: number;
}

interface PurchaseDetail {
  id: number;
  purchase_number: string;
  vendor_name: string;
  location_name: string;
  purchase_date: string;
  total_amount: string;
  currency: number;
  status: "received" | "pending";
  notes: string;
  total_items: number;
  total_quantity: number;
  items: PurchaseDetailItem[];
}

interface PurchaseListReceiptProps {
  purchase: PurchaseDetail;
}

export default function PurchaseListReceipt({
  purchase,
}: PurchaseListReceiptProps) {
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
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  const shopSettings = useSettingsStore((s) => s.shopSettings);
  const logoSettings = useSettingsStore((s) => s.logoSettings);
  const logosrc = logoSettings?.logo;
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    if (status === "received") {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else if (status === "pending") {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
    return `${baseClasses} bg-gray-100 text-gray-800`;
  };

  return (
    <div
      className="p-6 m-3 shadow-muted-front shadow-md rounded-md print:shadow-none"
      dir={direction}
      ref={contentRef}
    >
      {/* Header */}
      <div className="relative border-b pb-6 mb-6">
        {/* PDF Button */}
        <button
          className="absolute top-2 end-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow print:hidden"
          title="Download PDF"
          onClick={reactToPrintFn}
        >
          <Printer className="inline" /> {t("Print")}
        </button>
        <Logo src={logosrc || "/images/loddingImage.jpg"}>
          {shopSettings?.shop_name}
        </Logo>
        <div className="mt-4  grid grid-cols-1 md:grid-cols-2 ">
          <div className="text-start ">
            <div>
              <span className="text-gray-600 me-2">
                {t("Purchase Number")}:
              </span>
              <span className="font-semibold text-gray-900">
                {purchase.purchase_number}
              </span>
            </div>
            <div>
              <span className="text-gray-600 me-2">{t("Date")}:</span>
              <span className="font-semibold text-gray-900">
                {formatLocalDateTime(purchase.purchase_date)}
              </span>
            </div>
            <div>
              <span className="text-gray-600 me-2">{t("Vendor")}:</span>
              <span className="font-semibold text-gray-900">
                {purchase.vendor_name}
              </span>
            </div>
          </div>
          <div className="md:text-end">
            <div>
              <span className="text-gray-600 me-2">{t("Location")}:</span>
              <span className="font-semibold text-gray-900">
                {purchase.location_name || t("N/A")}
              </span>
            </div>
            <div>
              <span className="text-gray-600 me-2">{t("Status")}:</span>
              <span className={getStatusBadge(purchase.status)}>
                {purchase.status.charAt(0).toUpperCase() +
                  purchase.status.slice(1)}
              </span>
            </div>
            {purchase.notes && (
              <div>
                <span className="text-gray-600 me-2">{t("Notes")}:</span>
                <span className="font-medium text-gray-900">
                  {purchase.notes}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-auto w-96 md:w-full mx-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-slate-500 to-sky-800 text-white">
              <th className="px-4 py-3 print:px-2 print:py-1  text-sm font-semibold">
                {t("Product Name")}
              </th>
              <th className="px-4 py-3 print:px-2 print:py-1  text-sm font-semibold">
                {t("Barcode")}
              </th>
              <th className="px-4 py-3 print:px-2 print:py-1  text-sm font-semibold">
                {t("Quantity")}
              </th>
              <th className="px-4 py-3 print:px-2 print:py-1  text-sm font-semibold">
                {t("Unit Cost")}
              </th>
              <th className="px-4 py-3 print:px-2 print:py-1  text-sm font-semibold">
                {t("Line Total")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-100 divide-y divide-gray-200">
            {purchase.items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 print:px-2 print:py-1 text-center text-sm text-gray-900">
                  {item.product_name}
                </td>
                <td className="px-4 py-4 print:px-2 print:py-1 text-center text-sm text-gray-600 font-mono">
                  {item.barcode}
                </td>
                <td className="px-4 py-4 print:px-2 print:py-1 text-sm text-gray-900 text-center">
                  {parseFloat(item.quantity).toLocaleString()}
                </td>
                <td className="px-4 py-4 print:px-2 print:py-1 text-sm text-gray-900 text-center">
                  {formatPriceWithCurrency(
                    parseFloat(item.unit_cost),
                    item.currency
                  )}
                </td>
                <td className="px-4 py-4 print:px-2 print:py-1 text-sm font-medium text-gray-900 text-center">
                  {formatPriceWithCurrency(
                    parseFloat(item.line_total),
                    item.currency
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 border-t-2 border-gray-300">
              <td className="px-4 py-4 text-sm font-bold text-gray-900">
                {t("Totals")}
              </td>
              <td className="px-4 py-4"></td>
              <td className="px-4 py-4 text-sm font-bold text-gray-900 text-center">
                {purchase.total_quantity.toLocaleString()} {t("items")}
              </td>
              <td className="px-4 py-4 text-sm text-gray-600 text-center">
                {t("Sum of costs")}
              </td>
              <td className="px-4 py-4 text-lg font-bold text-gray-900 text-center">
                {formatPriceWithCurrency(
                  parseFloat(purchase.total_amount),
                  purchase.currency
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
