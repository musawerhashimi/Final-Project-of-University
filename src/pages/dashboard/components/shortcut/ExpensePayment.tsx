import { useReactToPrint } from "react-to-print";
import { useRef, useState } from "react";
import { useDirection } from "../../../../hooks/useDirection";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { apiClient } from "../../../../lib/api";
import { formatLocalDateTime } from "../../../../utils/formatLocalDateTime";
import { extractAxiosError } from "../../../../utils/extractError";
import { useCashDrawerStore } from "../../../../stores/useCashDrawerStore";
import { useCurrencyStore } from "../../../../stores";
import {
  paymentSchema,
  type PaymentFormData,
} from "../../../../schemas/expencePaymentValidation";
import { useTranslation } from "react-i18next";
import { Printer, CalendarDays, ListFilter } from "lucide-react";

interface ExpensePayment {
  id: number;
  expense_number: string;
  expense_category: string;
  amount: string;
  currency: number;
  expense_date: string;
  description: string;
  cash_drawer: number;
}

interface ExpenseCategory {
  id: number;
  name: string;
}

const getTodayDate = () => new Date().toISOString().split("T")[0];

function ExpensePayment() {
  const contentRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const direction = useDirection();
  const cashDrawers = useCashDrawerStore((s) => s.cashDrawers);
  const { currencies, formatPriceWithCurrency } = useCurrencyStore();
  const { t } = useTranslation();

  // State for the custom delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [PaymentToDeleteId, setPaymentToDeleteId] = useState<number | null>(
    null
  );

  // State for filters
  // Default to an empty string to fetch all payments initially
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [selectedResource, setSelectedResource] = useState<number>(0);

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

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: "",
      currency: 0,
      cash_drawer: 0,
      expense_category: 0,
      description: "",
    },
  });

  const selectedCashDrawer = watch("cash_drawer");

  // Fetch expense categories
  const { data: expenseCategories = [], isLoading: categoriesLoading } =
    useQuery({
      queryKey: ["expense-categories"],
      queryFn: async () => {
        const response = await apiClient.get<ExpenseCategory[]>(
          "/finance/expense-categories/"
        );
        return response.data;
      },
    });

  // Fetch expenses with filters
  const { data: expenses = [], isLoading: expensesLoading } = useQuery({
    queryKey: [
      "expenses",
      {
        date: selectedDate,
        category: selectedCategory,
        resource: selectedResource,
      },
    ],
    queryFn: async () => {
      // Build query parameters based on selected filters
      const params = new URLSearchParams();
      if (selectedDate) {
        params.append("expense_date", selectedDate);
      }
      if (selectedCategory > 0) {
        params.append("expense_category", selectedCategory.toString());
      }
      if (selectedResource > 0) {
        params.append("cash_drawer", selectedResource.toString());
      }

      const response = await apiClient.get<ExpensePayment[]>(
        `/finance/expenses/?${params.toString()}`
      );
      return response.data;
    },
  });

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: async (data: PaymentFormData) => {
      const payload = {
        expense_category: data.expense_category,
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        cash_drawer: data.cash_drawer,
        expense_date: new Date().toISOString(),
      };
      const response = await apiClient.post("/finance/expenses/", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success(t("Payment recorded successfully!"));
      reset();
    },
    onError: (error) => {
      const errorMessage = extractAxiosError(
        error,
        t("Failed to record payment")
      );
      toast.error(errorMessage);
    },
  });

  // Delete payment mutation
  const deletePaymentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/finance/expenses/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success(t("Payment deleted successfully!"));
    },
    onError: (error) => {
      const errorMessage = extractAxiosError(
        error,
        t("Failed to delete payment")
      );
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: PaymentFormData) => {
    createPaymentMutation.mutate(data);
  };

  const handleOpenDeleteModal = (id: number) => {
    setPaymentToDeleteId(id);
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = () => {
    if (PaymentToDeleteId !== null) {
      deletePaymentMutation.mutate(PaymentToDeleteId);
      setPaymentToDeleteId(null);
      setShowDeleteModal(false);
    }
  };
  const handleCancelDelete = () => {
    setPaymentToDeleteId(null);
    setShowDeleteModal(false);
  };

  const getCashDrawerName = (cashDrawerId: number) => {
    const drawer = cashDrawers.find((d) => d.id === cashDrawerId);
    return drawer?.name || t("Unknown");
  };

  if (expensesLoading || categoriesLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 font-inter">
      <h2 className="text-2xl font-bold text-green-700 mb-5">
        {t("Record an Expense Payment")}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("Amount *")}
          </label>
          <input
            type="number"
            step="0.01"
            id="amount"
            {...register("amount")}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200 ${
              errors.amount ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., 50.00"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
        </div>
        {/* Currency Select */}
        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("Currency *")}
          </label>
          <select
            id="currency"
            {...register("currency", { valueAsNumber: true })}
            className={`w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200 ${
              errors.currency ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value={0}>{t("Select Currency")}</option>
            {currencies.map((currency) => (
              <option key={currency.id} value={currency.id}>
                {currency.code}
              </option>
            ))}
          </select>
          {errors.currency && (
            <p className="text-red-500 text-sm mt-1">
              {errors.currency.message}
            </p>
          )}
        </div>
        {/* Cash Drawer (Resources) Select */}
        <div>
          <label
            htmlFor="cash_drawer"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("Resources *")}
          </label>
          <select
            id="cash_drawer"
            {...register("cash_drawer", { valueAsNumber: true })}
            className={`w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200 ${
              errors.cash_drawer ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value={0}>{t("Select Resource")}</option>
            {cashDrawers.map((drawer) => (
              <option key={drawer.id} value={drawer.id}>
                {drawer.name}
              </option>
            ))}
          </select>
          {errors.cash_drawer && (
            <p className="text-red-500 text-sm mt-1">
              {errors.cash_drawer.message}
            </p>
          )}
          {!selectedCashDrawer && (
            <p className="text-gray-500 text-sm mt-1">
              {t("Please select a resource first")}
            </p>
          )}
        </div>
        {/* Expense Category Select */}
        <div>
          <label
            htmlFor="expense_category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("Expense Category *")}
          </label>
          <select
            id="expense_category"
            {...register("expense_category", { valueAsNumber: true })}
            className={`w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200 ${
              errors.expense_category ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value={0}>{t("Select an Expense Category")}</option>
            {expenseCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.expense_category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.expense_category.message}
            </p>
          )}
        </div>
        {/* Description Input */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("Description *")}
          </label>
          <textarea
            id="description"
            rows={3}
            {...register("description")}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("Enter expense description...")}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || createPaymentMutation.isPending}
          className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || createPaymentMutation.isPending
            ? t("Recording...")
            : t("Record Payment")}
        </button>
      </form>

      {/* Payments List */}
      <div className="mt-8 p-4 relative" dir={direction} ref={contentRef}>
        <h3 className="text-2xl print:text-xl font-semibold text-gray-700 mb-4">
          {t("Expense Payments List")}
        </h3>

        {/* Combined Filter Controls and Print Button */}
        <div className="flex flex-wrap items-end gap-3 mb-6 print:hidden">
          {/* Date Filter */}
          <div className="flex-grow">
            <label
              htmlFor="filter-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("Filter by Date")}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                id="filter-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setSelectedDate(getTodayDate())}
                className="p-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 transition duration-200"
                title={t("Filter by Today's Date")}
              >
                <CalendarDays size={20} />
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate("")}
                className="p-2 bg-gray-500 text-white rounded-lg shadow-sm hover:bg-gray-600 transition duration-200"
                title={t("Show All Dates")}
              >
                <ListFilter size={20} />
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex-grow">
            <label
              htmlFor="filter-category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("Filter by Category")}
            </label>
            <select
              id="filter-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(Number(e.target.value))}
              className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
            >
              <option value={0}>{t("All Categories")}</option>
              {expenseCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Resource Filter */}
          <div className="flex-grow">
            <label
              htmlFor="filter-resource"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("Filter by Resource")}
            </label>
            <select
              id="filter-resource"
              value={selectedResource}
              onChange={(e) => setSelectedResource(Number(e.target.value))}
              className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
            >
              <option value={0}>{t("All Resources")}</option>
              {cashDrawers.map((drawer) => (
                <option key={drawer.id} value={drawer.id}>
                  {drawer.name}
                </option>
              ))}
            </select>
          </div>

          {/* Print Button */}
          <button
            className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
            title="Download PDF"
            onClick={reactToPrintFn}
          >
            <Printer className="inline mr-2" /> {t("Print")}
          </button>
        </div>

        {expenses.length === 0 ? (
          <p className="text-gray-500 italic">
            {t("No payments recorded for this period.")}
          </p>
        ) : (
          <div className="overflow-auto mx-auto w-96 md:w-full shadow-md rounded-lg border border-gray-200">
            <table className="w-full text-sm text-center text-gray-700">
              <thead className="text-xs text-gray-700 uppercase bg-blue-100">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 print:px-3 print:py-2 rounded-tl-lg"
                  >
                    {t("Expense Number")}
                  </th>
                  <th scope="col" className="px-6 py-3 print:px-3 print:py-2">
                    {t("Category")}
                  </th>
                  <th scope="col" className="px-6 py-3 print:px-3 print:py-2">
                    {t("Amount")}
                  </th>
                  <th scope="col" className="px-6 py-3 print:px-3 print:py-2">
                    {t("Resource")}
                  </th>
                  <th scope="col" className="px-6 py-3 print:px-3 print:py-2">
                    {t("Description")}
                  </th>
                  <th scope="col" className="px-6 py-3 print:px-3 print:py-2">
                    {t("Payment Date")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 print:px-3 print:py-2 rounded-tr-lg print:hidden"
                  >
                    {t("Action")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((payment) => (
                  <tr
                    key={payment.id}
                    className="bg-white border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 print:px-3 print:py-2 font-medium text-gray-900 whitespace-nowrap">
                      {payment.expense_number}
                    </td>
                    <td className="px-6 py-4 print:px-3 print:py-2">
                      {
                        expenseCategories.find(
                          (category) =>
                            category.id === Number(payment.expense_category)
                        )?.name
                      }
                    </td>
                    <td className="px-6 py-4 print:px-3 print:py-2">
                      {formatPriceWithCurrency(
                        parseFloat(payment.amount),
                        payment.currency
                      )}
                    </td>
                    <td className="px-6 py-4 print:px-3 print:py-2">
                      {getCashDrawerName(payment.cash_drawer)}
                    </td>
                    <td className="px-6 py-4 print:px-3 print:py-2 max-w-xs truncate">
                      {payment.description}
                    </td>
                    <td className="px-6 py-4 print:px-3 print:py-2">
                      {formatLocalDateTime(payment.expense_date)}
                    </td>
                    <td className="print:hidden">
                      <button
                        onClick={() => handleOpenDeleteModal(payment.id)}
                        disabled={deletePaymentMutation.isPending}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200 text-sm disabled:opacity-50"
                      >
                        {deletePaymentMutation.isPending
                          ? t("Deleting...")
                          : t("Delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md font-inter">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm mx-auto animate-fade-in-up">
            <h3 className="text-2xl font-bold text-red-600 mb-4">
              {t("Confirm Deletion")}
            </h3>
            <p className="text-gray-700 mb-6">
              {t(
                "Are you sure you want to delete this expense payment? This action cannot be undone."
              )}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition duration-200"
              >
                {t("Cancel")}
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletePaymentMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletePaymentMutation.isPending
                  ? t("Deleting...")
                  : t("Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpensePayment;
