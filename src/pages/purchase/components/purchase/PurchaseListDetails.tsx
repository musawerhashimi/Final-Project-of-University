import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../lib/api";
import RouteBox from "../../../../components/RouteBox";
import PurchaseListReceipt from "./PurchaseListReceipt";
import { useTranslation } from "react-i18next";

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

export default function PurchaseListDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const {
    data: purchase,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["purchase", id],
    queryFn: async () => {
      const response = await apiClient.get<PurchaseDetail>(
        `/vendors/purchases/${id}`
      );
      return response.data;
    },
    enabled: !!id,
  });

  const route = [
    { path: "/purchase", name: t("Purchase") },
    { path: "/purchase/purchaseList", name: t("Purchase List") },
    { path: "", name: purchase?.purchase_number || t("Loading...") },
  ];

  if (isLoading) {
    return (
      <>
        <RouteBox items={route} routlength={route.length} />
        <div className="p-5 m-3 shadow-muted-front shadow-md rounded-md bg-white">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">
              {t("Loading purchase details...")}
            </span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <RouteBox items={route} routlength={route.length} />
        <div className="p-5 m-3 shadow-muted-front shadow-md rounded-md bg-white">
          <div className="text-red-500 text-center p-4">
            {t("Error loading purchase details")} {error.message}
          </div>
        </div>
      </>
    );
  }

  if (!purchase) {
    return (
      <>
        <RouteBox items={route} routlength={route.length} />
        <div className="p-5 m-3 shadow-muted-front shadow-md rounded-md bg-white">
          <p className="text-red-500 p-4 text-center">
            {t("Purchase not found")}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <RouteBox items={route} routlength={route.length} />
      <PurchaseListReceipt purchase={purchase} />
    </>
  );
}
