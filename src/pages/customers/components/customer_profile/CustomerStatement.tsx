import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { AxiosError } from "axios";

import RouteBox from "../../../../components/RouteBox";
import { useCurrencyStore } from "../../../../stores/useCurrencyStore";
import { useCashDrawerStore } from "../../../../stores/useCashDrawerStore";
import apiClient from "../../../../lib/api";
import { formatLocalDateTime } from "../../../../utils/formatLocalDateTime";

interface CustomerStatement {
  id: number;
  customer: number;
  amount: string;
  currency: number;
  statement_type: "cash" | "loan";
  statement_date: string;
  sale_receipt_id?: string;
  cash_drawer: number;
  notes: string;
  created_by_name: string;
}

interface StatementFormData {
  customer: number;
  amount: number;
  currency: number;
  statement_type: "cash" | "loan";
  cash_drawer: number;
  notes: string;
}

function CustomerStatement() {
  const { t } = useTranslation();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const currencies = useCurrencyStore((s) => s.currencies);
  const cashDrawers = useCashDrawerStore((s) => s.cashDrawers);
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StatementFormData>();

  // Fetch customer statements
  const { data, isLoading, error } = useQuery<{
    name: string;
    statements: CustomerStatement[];
  }>({
    queryKey: ["customer", id, "statements"],
    queryFn: async () => {
      const response = await apiClient.get(
        `/customers/customers/${id}/statements`
      );
      return response.data;
    },
  });
  const { name, statements } = data || { name: "", statements: [] };

  // Create statement mutation
  const createStatementMutation = useMutation({
    mutationFn: async (data: StatementFormData) => {
      const payload = {
        ...data,
        customer: id,
      };
      const response = await apiClient.post(
        "/customers/customer-statements/",
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customer", id, "statements"],
      });
      reset(); // Clear form after successful submission
      toast.success(t("Successfully declared a statement."));
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(
        error.response?.data.error || t("Failed to create the statement")
      );
    },
  });

  const onSubmit = (formData: StatementFormData) => {
    const submitData = {
      ...formData,
      customer: Number(id),
      amount: Number(formData.amount),
      currency: Number(formData.currency),
      cash_drawer: Number(formData.cash_drawer),
    };

    createStatementMutation.mutate(submitData);
  };

  const routename = [
    { path: "/customers", name: t("Customers") },
    {
      path: `/customers/${id}`,
      name: `${name}`,
    },
    { path: "", name: t("Statement") },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">{t("Loading statements...")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">{t("Error loading statements")}</p>
      </div>
    );
  }

  return (
    <>
      <RouteBox items={routename} routlength={routename.length} />

      <div className=" bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-2">
          {/* Header section with a clean, combined title */}
          <div className="flex items-center mb-6 border-b pb-4">
            <FaUser className="text-indigo-500 text-2xl mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">
              {name} - {t("Statement")}
            </h2>
          </div>

          {/* Form to add a new statement */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Amount Input */}
              <div className="relative">
                <input
                  {...register("amount", {
                    required: t("Amount is required"),
                    min: {
                      value: 0.01,
                      message: t("Amount must be greater than 0"),
                    },
                  })}
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder={t("Amount")}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Currency Select */}
              <div className="relative">
                <select
                  {...register("currency", {
                    required: t("Please select a currency"),
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="">{t("Select Currency")}</option>
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

              {/* Statement Type Select */}
              <div className="relative">
                <select
                  {...register("statement_type", {
                    required: t("Please select a type"),
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="">{t("Select type")}</option>
                  <option value="cash">{t("Cash")}</option>
                  <option value="loan">{t("Loan")}</option>
                </select>
                {errors.statement_type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.statement_type.message}
                  </p>
                )}
              </div>

              {/* Cash Drawer Select */}
              <div className="relative">
                <select
                  {...register("cash_drawer", {
                    required: t("Please select a cash drawer"),
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="">{t("Select Resources")}</option>
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
              </div>

              {/* Notes Input */}
              <div className="relative col-span-full">
                <input
                  {...register("notes")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder={t("Add description here!")}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={createStatementMutation.isPending}
              className="w-full sm:w-auto mt-4 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
            >
              {createStatementMutation.isPending
                ? t("Submitting...")
                : t("Submit")}
            </button>
          </form>
        </div>

        {/* Statements Table */}
        <div className="mx-auto md:w-full w-96 overflow-auto bg-white rounded-xl shadow-lg mt-8">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-nowrap uppercase text-xs font-semibold text-gray-600">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {t("ID")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t("Amount")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t("Type")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t("Description")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t("Sale Receipt ID")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t("Added By")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t("Date")}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t("Action")}
                </th>
              </tr>
            </thead>
            <tbody>
              {statements.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 font-medium text-indigo-600">
                    {row.id}
                  </td>
                  <td className="px-6 py-4">
                    {formatPriceWithCurrency(
                      parseFloat(row.amount),
                      row.currency
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.statement_type === "cash"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {row.statement_type === "cash"
                        ? t("Cash Received")
                        : t("Loan")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {row.notes || (
                      <span className="text-gray-400 italic">{t("empty")}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{row.sale_receipt_id || "-"}</td>
                  <td className="px-6 py-4">{row.created_by_name}</td>
                  <td className="px-6 py-4">
                    {formatLocalDateTime(row.statement_date)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => console.log("deleted", row.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-150"
                    >
                      {t("Delete")}
                    </button>
                  </td>
                </tr>
              ))}
              {statements.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-gray-400 py-6">
                    {t("No data available.")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default CustomerStatement;
