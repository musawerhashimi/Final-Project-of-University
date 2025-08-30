import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Printer, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "../../../../../lib/api";
import { useCurrencyStore } from "../../../../../stores/useCurrencyStore";
import RouteBox from "../../../../../components/RouteBox";
import MonthlyPaymentForm from "./MonthlyPaymentForm";
import type { AxiosError } from "axios";
import type { MonthlyPayment, References } from "../../../../../entities/";
import type { MonthlyPaymentFormData } from "../../../../../schemas/monthlypaymentSchema";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import { useDirection } from "../../../../../hooks/useDirection";

export default function MonthlyPayments() {
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
  const [editingPayment, setEditingPayment] = useState<MonthlyPayment | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const routename = [
    { path: "/finance", name: t("Finance") },
    { path: "", name: t("Monthly Payment") },
  ];

  // Fetch monthly payments
  const { data: monthlyPayments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["monthly-payments"],
    queryFn: async () => {
      const response = await apiClient.get("/finance/monthly-payments/");
      return response.data as MonthlyPayment[];
    },
  });

  // Fetch references (employees and expense categories)
  const { data: references, isLoading: referencesLoading } = useQuery({
    queryKey: ["monthly-payments-references"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/finance/monthly-payments/references"
      );
      return response.data as References;
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: MonthlyPaymentFormData) => {
      const payload = {
        ...data,
        payment_method: "cash",
      };
      const response = await apiClient.post(
        "/finance/monthly-payments/",
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-payments"] });
      toast.success(t("Monthly payment added successfully!"));
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || t("Failed to add monthly payment")
      );
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: MonthlyPaymentFormData;
    }) => {
      const payload = {
        ...data,
        payment_method: "cash",
      };
      const response = await apiClient.put(
        `/finance/monthly-payments/${id}/`,
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-payments"] });
      setEditingPayment(null);
      setIsEditModalOpen(false);
      toast.success(t("Monthly payment updated successfully!"));
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || t("Failed to update monthly payment")
      );
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/finance/monthly-payments/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-payments"] });
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      toast.success(t("Monthly payment deleted successfully!"));
    },
    onError: (error: AxiosError) => {
      toast.error(
        String(error.response?.data) || t("Failed to delete monthly payment")
      );
    },
  });

  // Handle form submission
  const handleFormSubmit = (data: MonthlyPaymentFormData) => {
    if (editingPayment) {
      updateMutation.mutate({ id: editingPayment.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Open edit modal
  const openEditModal = (payment: MonthlyPayment) => {
    setEditingPayment(payment);
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = () => {
    if (deleteId !== null) {
      deleteMutation.mutate(deleteId);
    }
  };

  // Get reference name
  const getReferenceName = (referenceType: string, referenceId: number) => {
    if (!references) return "";

    if (referenceType === "employee") {
      const employee = references.employees.find((e) => e.id === referenceId);
      return employee?.name || "";
    } else if (referenceType === "expense_category") {
      const category = references.expense_categories.find(
        (c) => c.id === referenceId
      );
      return category?.name || "";
    }
    return "";
  };

  const isLoading = paymentsLoading || referencesLoading;
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  return (
    <>
      <RouteBox items={routename} routlength={routename.length} />
      <div className="mt-[-15px] bg-gradient-to-br from-blue-100 to-purple-100 p-4 sm:p-6 font-sans">
        {/* Form Section */}
        <div className="bg-white rounded-md shadow-md p-6 sm:p-8 w-full mb-8">
          <h2 className="bg-gradient-to-r from-blue-600 to-green-200 text-white py-2 rounded-lg shadow-md text-3xl font-extrabold mb-6 text-center">
            {t("Add New Monthly Payment")}
          </h2>
          <MonthlyPaymentForm
            onSubmit={handleFormSubmit}
            initialData={null}
            references={references}
            isLoading={createMutation.isPending}
          />
        </div>

        {/* Table Section */}
        <div
          className="relative overflow-auto md:w-full w-96 mx-auto bg-white p-6 rounded-xl shadow-lg print:shadow-none print:rounded-0 print:border-2 print:p-2 "
          dir={direction}
          ref={contentRef}
        >
          {/* PDF Button */}
          <button
            className="absolute top-7 right-8 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow print:hidden"
            title="Download PDF"
            onClick={reactToPrintFn}
          >
            <Printer className="inline" />
            <span className="hidden md:inline">{t("Print")}</span>
          </button>
          <h2 className="md:text-2xl text-sm font-bold print:mb-2  mb-6 text-center bg-gradient-to-r from-blue-500 to-sky-700 md:p-2 p-4 rounded-md text-white">
            {t("Monthly Payments List")}
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : monthlyPayments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              {t("No monthly payments recorded yet.")}
            </p>
          ) : (
            <table className="w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50 whitespace-nowrap">
                <tr>
                  <th className="px-6 py-3 text-center print:px-2 print:py-1 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                    {t("Payment Name")}
                  </th>
                  <th className="px-6 py-3 text-center print:px-2 print:py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("Amount")}
                  </th>
                  <th className="px-6 py-3 text-center print:px-2 print:py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("Reference")}
                  </th>
                  <th className="px-6 py-3 text-center print:px-2 print:py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("Reference Name")}
                  </th>
                  <th className="px-6 py-3 text-center print:px-2 print:py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("Start Date")}
                  </th>
                  <th className="px-6 py-3 text-center print:px-2 print:py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("End Date")}
                  </th>
                  <th className="px-6 py-3 text-center print:px-2 print:py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("Description")}
                  </th>
                  <th className="print:hidden px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                    {t("Actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-center print:px-2 print:py-1 font-medium text-gray-900">
                      {payment.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-center print:px-2 print:py-1 text-gray-700">
                      {formatPriceWithCurrency(
                        parseFloat(payment.amount),
                        payment.currency
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-center print:px-2 print:py-1 text-gray-700">
                      {payment.reference_type === "employee"
                        ? t("Employee")
                        : t("Expense Category")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-center print:px-2 print:py-1 text-gray-700">
                      {getReferenceName(
                        payment.reference_type,
                        payment.reference_id
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-center print:px-2 print:py-1 text-gray-700">
                      {payment.start_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-center print:px-2 print:py-1 text-gray-700">
                      {payment.end_date || t("N/A")}
                    </td>
                    <td className="px-6 py-4 text-sm  text-center print:px-2 print:py-1 text-gray-700 max-w-xs truncate">
                      {payment.description || t("No description")}
                    </td>
                    <td className="print:hidden px-6 py-4 whitespace-nowrap  text-sm  text-center print:px-2 print:py-1 font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openEditModal(payment)}
                          disabled={updateMutation.isPending}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-2 rounded-full hover:bg-blue-100 disabled:opacity-50"
                          title="Edit Payment"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(payment.id);
                            setIsDeleteModalOpen(true);
                          }}
                          disabled={deleteMutation.isPending}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 p-2 rounded-full hover:bg-red-100 disabled:opacity-50"
                          title="Delete Payment"
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
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {t("Edit Monthly Payment")}
              </h2>
              <MonthlyPaymentForm
                onSubmit={handleFormSubmit}
                initialData={
                  editingPayment
                    ? {
                        ...editingPayment,
                        amount: parseFloat(editingPayment.amount),
                      }
                    : null
                }
                references={references}
                isLoading={updateMutation.isPending}
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {t("Confirm Deletion")}
              </h2>
              <p className="text-gray-600 mb-6">
                {t("Are you sure you want to delete this payment?")}
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out disabled:opacity-50"
                >
                  {deleteMutation.isPending ? t("Deleting...") : t("Delete")}
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={deleteMutation.isPending}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out disabled:opacity-50"
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
