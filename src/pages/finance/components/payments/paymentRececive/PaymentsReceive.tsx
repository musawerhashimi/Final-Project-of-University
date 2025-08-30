import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Printer, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import RouteBox from "../../../../../components/RouteBox";
import type { DirectTransaction } from "../../../../../entities/Transaction";
import { apiClient } from "../../../../../lib/api"; // Adjust path as needed
import type { PaymentReceiveFormData } from "../../../../../schemas/paymentReceiveSchema";
import { useCurrencyStore } from "../../../../../stores";
import PaymentReceiveForm from "./PaymentReceiveForm";
import { useCashDrawerStore } from "../../../../../stores/useCashDrawerStore";
import { toast } from "sonner";
import { formatLocalDateTime } from "../../../../../utils/formatLocalDateTime";
import { useTranslation } from "react-i18next";
import { useDirection } from "../../../../../hooks/useDirection";
import { useReactToPrint } from "react-to-print";

export default function PaymentsReceive() {
  const [editingTransaction] = useState<DirectTransaction | null>(null);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const queryClient = useQueryClient();
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
  const routename = [
    { path: "/finance", name: t("Finance") },
    { path: "", name: t("Payment & Receive") },
  ];

  // Fetch transactions (you might need to adjust this endpoint)
  const { data: transactions = [], isLoading } = useQuery<DirectTransaction[]>({
    queryKey: ["direct-transactions"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/finance/transactions/direct-transactions"
      );
      return response.data;
    },
  });

  // Create transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: async (data: PaymentReceiveFormData) => {
      const payload = {
        transaction_type: data.transaction_type,
        party_type: data.party_type,
        party_id: data.party_id,
        amount: data.amount,
        currency: data.currency, // Assuming currency is stored as ID
        cash_drawer: data.cash_drawer_id, // Assuming resources is cash_drawer ID
        description: data.description || "",
      };

      const response = await apiClient.post("/finance/transactions/", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t("Transaction added Successfully"));
      queryClient.invalidateQueries({ queryKey: ["direct-transactions"] });
    },
  });

  // Delete transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/finance/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["direct-transactions"] });
      setDeleteId(null);
      setIsDeleteModalOpen(false); // <-- closes modal after success
    },
    onError: (error) => {
      toast.error(t("Failed to delete transaction"));
      setIsDeleteModalOpen(false); // <-- closes modal after error
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (deleteId !== null) {
      deleteTransactionMutation.mutate(deleteId);
      // Do NOT call setIsDeleteModalOpen(false) here!
    }
  };
  const handleFormSubmit = (data: PaymentReceiveFormData) => {
    if (editingTransaction) {
      // updateTransactionMutation.mutate({ id: editingTransaction.id, data });
    } else {
      createTransactionMutation.mutate(data);
    }
  };

  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  const cashDrawers = useCashDrawerStore((s) => s.cashDrawers);
  const getCashDrawerName = (id: number) => {
    return cashDrawers.find((c) => c.id === id)?.name || "";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <RouteBox items={routename} routlength={routename.length} />

      <div className="mt-[-15px]  p-6 bg-gradient-to-br from-blue-100 to-purple-100 ">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full mb-8">
          <h2 className="text-3xl font-extrabold  mb-6 text-center bg-gradient-to-r from-blue-600 to-green-200 text-white py-2 rounded-lg shadow-md">
            {t("Add New Payment / Receive")}
          </h2>
          <PaymentReceiveForm onSubmit={handleFormSubmit} initialData={null} />
        </div>

        <div
          className="print:border-1 relative bg-white rounded-xl shadow-lg p-6 sm:p-8  overflow-auto mx-auto w-96 md:w-full print:p-2 print:shadow-0"
          dir={direction}
          ref={contentRef}
        >
          <h2 className="text-md md:text-3xl font-extrabold  mb-6 print:mb-2 text-center bg-gradient-to-r from-blue-500 to-sky-700 md:p-2  p-4 rounded-md text-white">
            {t("Payments & Receives List")}
          </h2>
          {/* PDF Button */}
          <button
            className="absolute top-8 md:top-10 right-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow print:hidden"
            title="Download PDF"
            onClick={reactToPrintFn}
          >
            <Printer className="inline" />
            <span className="hidden md:inline">{t("Print")}</span>
          </button>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              {t("No Transaction recorded yet.")}
            </p>
          ) : (
            <table className="w-full divide-y text-xs divide-gray-200">
              <thead className="bg-gray-50 whitespace-nowrap">
                <tr>
                  <th className="px-6 py-3 text-center print:px-2 print:py-2 text-xs font-medium text-gray-500 uppercase whitespace-nowrap rounded-tl-lg">
                    {t("Transaction Type")}
                  </th>
                  <th className="px-6 py-3 text-center print:px-2 print:py-2 text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                    {t("Transaction Category")}
                  </th>
                  <th className="px-6 py-3 text-center print:px-2 print:py-2 text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                    {t("Transaction Name")}
                  </th>
                  <th className="px-6 py-3 text-center print:px-2 print:py-2 text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                    {t("Amount")}
                  </th>
                  <th className="px-6 py-3 text-center print:px-2 print:py-2 text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                    {t("Resource")}
                  </th>
                  <th className="px-6 py-3 text-center print:px-2 print:py-2 text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                    {t("Date")}
                  </th>
                  <th className="px-6 py-3 text-center print:px-2 print:py-2 text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                    {t("Description")}
                  </th>
                  <th className="print:hidden px-6 py-3 text-center print:px-2 print:py-2 text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                    {t("Actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td
                      className={`px-6 py-4 print:px-2 print:py-1 text-center whitespace-nowrap text-xs font-semibold ${
                        tx.transaction_type === "pay"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {tx.transaction_type.charAt(0).toUpperCase() +
                        tx.transaction_type.slice(1)}
                    </td>
                    <td className="px-6 py-4 print:px-2 print:py-1 text-center whitespace-nowrap text-xs text-gray-700">
                      {tx.party_type?.charAt(0).toUpperCase() +
                        tx.party_type?.slice(1)}
                    </td>
                    <td className="px-6 py-4 print:px-2 print:py-1 text-center whitespace-nowrap text-xs text-gray-700">
                      {tx.party_name}
                    </td>
                    <td className="px-6 py-4 print:px-2 print:py-1 text-center whitespace-nowrap text-xs text-gray-700">
                      {formatPriceWithCurrency(
                        parseFloat(tx.amount),
                        tx.currency
                      )}
                    </td>
                    <td className="px-6 py-4 print:px-2 print:py-1 text-center whitespace-nowrap text-xs text-gray-700">
                      {getCashDrawerName(tx.cash_drawer_id)}
                    </td>
                    <td className="px-6 py-4 print:px-2 print:py-1 text-center whitespace-nowrap text-xs text-gray-700">
                      {formatLocalDateTime(tx.transaction_date)}
                    </td>
                    <td className="px-6 py-4 print:px-2 print:py-1 text-center whitespace-nowrap text-xs text-gray-700">
                      {tx.description ? tx.description : t("N/A")}
                    </td>
                    <td className="print:hidden px-6 py-4 print:px-2 print:py-1 text-center whitespace-nowrap  text-xs font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            setDeleteId(tx.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 p-2 rounded-full hover:bg-red-100"
                          title="Delete Transaction"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit Form Modal */}
        {/* {isEditModalOpen && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {t("Edit Payment / Receive")}
              </h2>
              <PaymentReceiveForm
                onSubmit={handleFormSubmit}
                initialData={editingTransaction}
              />
            </div>
          </div>
        )} */}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {t("Confirm Deletion")}
              </h2>
              <p className="text-gray-600 mb-6">
                {t("Are you sure you want to delete this transaction?")}
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleDelete}
                  disabled={deleteTransactionMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out disabled:opacity-50"
                >
                  {deleteTransactionMutation.isPending
                    ? t("Deleting...")
                    : t("Delete")}
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                >
                  {t("Cancel")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
