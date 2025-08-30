import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { FaPaperPlane, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useCurrencyStore, useVendorStore } from "../../../../../stores";
import { useCashDrawerStore } from "../../../../../stores/useCashDrawerStore";
import apiClient from "../../../../../lib/api";
import { AxiosError } from "axios";
import {
  transactionSchema,
  type TransactionFormData,
} from "../../../../../schemas/vendorPaymentValidation";
import { useTranslation } from "react-i18next";

function VendorPayment({ id }: { id: number }) {
  // 2. React Hook Form setup with Zod resolver
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch, // To watch for changes in 'type' for conditional styling
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      type: "pay", // Default to 'pay'
      description: "",
    },
  });

  // Watch the 'type' field to apply dynamic styles
  const transactionType = watch("type");

  const currencies = useCurrencyStore((s) => s.currencies);
  const cashDrawers = useCashDrawerStore((s) => s.cashDrawers);
  const updateVendorBalance = useVendorStore((s) => s.updateVendorBalance);

  // 3. Form submission handler
  const onSubmit = async (data: TransactionFormData) => {
    const payload = {
      transaction_type: data.type,
      party_type: "vendors",
      party_id: Number(id),
      amount: data.amount,
      currency: data.currency, // Assuming currency is stored as ID
      cash_drawer: data.cash_drawer, // Assuming resources is cash_drawer ID
      description: data.description || "",
    };

    try {
      await apiClient.post("/finance/transactions/", payload);
      reset();
      toast.success(t("Vendor Payment Transaction made successfully"));
      updateVendorBalance(id, payload.amount, payload.currency);
      return;
    } catch (error) {
      let flatMessage = t("Failed to update vendor");
      if (error instanceof AxiosError && error.response) {
        const err = error.response.data;
        flatMessage =
          typeof err === "string"
            ? err
            : typeof err === "object"
            ? Object.values(err).flat().join("\n")
            : flatMessage;
      }
      toast.error(flatMessage);
    }
  };

  return (
    <div className=" flex items-center justify-center">
      <Toaster position="top-center" reverseOrder={false} />{" "}
      <div className="w-full  bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 mt-0 sm:p-10 border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-8 border-b pb-4 border-gray-200 dark:border-gray-700">
          {t("Vendor Payment")}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3"
        >
          {/* Amount Field */}
          <div>
            <label
              htmlFor="amount"
              className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
            >
              {t("Amount")}:
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              {...register("amount", { valueAsNumber: true })}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-sm"
              placeholder="e.g., 150.75"
            />
            {errors.amount && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Currency Select */}
          <div>
            <label
              htmlFor="currency"
              className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
            >
              {t("Currency")}:
            </label>
            <div className="relative">
              <select
                id="currency"
                {...register("currency", { valueAsNumber: true })}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-sm appearance-none pr-10"
              >
                <option value="">{t("Select Currency")}</option>
                {currencies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {errors.currency && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.currency.message}
              </p>
            )}
          </div>

          {/* Resource Select */}
          <div>
            <label
              htmlFor="resource"
              className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
            >
              {t("Resource")}:
            </label>
            <div className="relative">
              <select
                id="resource"
                {...register("cash_drawer", { valueAsNumber: true })}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-sm appearance-none pr-10"
              >
                <option value="">{t("Select Resource")}</option>
                {cashDrawers.map((cd) => (
                  <option key={cd.id} value={cd.id}>
                    {cd.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {errors.cash_drawer && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.cash_drawer.message}
              </p>
            )}
          </div>

          {/* Type Radio Buttons */}
          <div>
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("Transaction Type")}:
            </span>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <label
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 shadow-sm flex-1 justify-center
                  ${
                    transactionType === "pay"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }
                `}
              >
                <input
                  type="radio"
                  {...register("type")}
                  value="pay"
                  className="hidden"
                />
                <FaArrowUp className="mr-2" /> {t("Pay")}
              </label>
              <label
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 shadow-sm flex-1 justify-center
                  ${
                    transactionType === "receive"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }
                `}
              >
                <input
                  type="radio"
                  {...register("type")}
                  value="receive"
                  className="hidden"
                />
                <FaArrowDown className="mr-2" /> {t("Receive")}
              </label>
            </div>
            {errors.type && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Description Field (Optional) */}
          <div>
            <label
              htmlFor="description"
              className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center"
            >
              {t("Description (Optional)")}:
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={3}
              className=" w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-sm resize-y"
              placeholder="Add a brief description of the transaction..."
            ></textarea>
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full  h-15 mt-10 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold px-10 py-4 rounded-full shadow-lg transform transition-all duration-300 ease-in-out  focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center gap-2 mx-auto text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane />
            {isSubmitting ? t("Submitting...") : t("Register Transaction")}
          </button>

          {/* Submit Button */}
        </form>
      </div>
    </div>
  );
}

export default VendorPayment;
