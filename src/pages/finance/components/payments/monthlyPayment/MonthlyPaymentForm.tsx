import { zodResolver } from "@hookform/resolvers/zod";
import {
  MonitorCheck,
  DollarSign,
  UserCheck,
  User,
  Calendar,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCurrencyStore } from "../../../../../stores/useCurrencyStore";
import {
  monthlyPaymentSchema,
  type MonthlyPaymentFormData,
} from "../../../../../schemas/monthlypaymentSchema";
import type { References } from "../../../../../entities/";
import { useTranslation } from "react-i18next";

interface PaymentFormProps {
  initialData?: MonthlyPaymentFormData | null;
  onSubmit: (data: MonthlyPaymentFormData) => void;
  references?: References;
  isLoading?: boolean;
}

export default function MonthlyPaymentForm({
  initialData,
  onSubmit,
  references,
  isLoading = false,
}: PaymentFormProps) {
  const currencies = useCurrencyStore((s) => s.currencies);
  const { t } = useTranslation();
  // Local state for reference type to update reference options
  const [localReferenceType, setLocalReferenceType] = useState<
    "employee" | "expense_category"
  >(initialData?.reference_type || "employee");

  const getReferenceOptions = () => {
    if (!references) return [];

    switch (localReferenceType) {
      case "employee":
        return references.employees;
      case "expense_category":
        return references.expense_categories;
      default:
        return [];
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MonthlyPaymentFormData>({
    resolver: zodResolver(monthlyPaymentSchema),
    defaultValues: initialData || {
      name: "",
      amount: 0,
      currency: 0,
      start_date: "",
      end_date: "",
      description: "",
      reference_type: "employee",
      reference_id: 0,
    },
  });

  // When initialData changes (edit), reset the form and localReferenceType
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        amount: initialData.amount,
        currency: initialData.currency,
        start_date: initialData.start_date,
        end_date: initialData.end_date || "",
        description: initialData.description || "",
        reference_type: initialData.reference_type,
        reference_id: initialData.reference_id,
      });
      setLocalReferenceType(initialData.reference_type);
    } else {
      reset({
        name: "",
        amount: 0,
        currency: 0,
        start_date: "",
        end_date: "",
        description: "",
        reference_type: "employee",
        reference_id: 0,
      });
      setLocalReferenceType("employee");
    }
  }, [initialData, reset]);

  // If reference type changes, clear reference_id
  useEffect(() => {
    reset((prev) => ({
      ...prev,
      reference_type: localReferenceType,
      reference_id: 0,
    }));
    // eslint-disable-next-line
  }, [localReferenceType]);

  const handleFormSubmit = (data: MonthlyPaymentFormData) => {
    // Convert empty end_date to undefined
    const formattedData = {
      ...data,
      end_date: data.end_date === "" ? undefined : data.end_date,
      description: data.description === "" ? undefined : data.description,
    };
    onSubmit(formattedData);
  };

  return (
    <form
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      {/* Payment Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <MonitorCheck className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
          {t("Payment Name")}
        </label>
        <input
          type="text"
          id="name"
          {...register("name")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          placeholder={t("e.g., Salary for Employees")}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <DollarSign className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
          {t("Amount")}
        </label>
        <input
          type="number"
          id="amount"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          placeholder="e.g., 3500"
        />
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
        )}
      </div>

      {/* Currency Select */}
      <div className="relative">
        <label
          htmlFor="currency"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <DollarSign className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
          {t("Currency")}
        </label>
        <select
          id="currency"
          {...register("currency", { valueAsNumber: true })}
          className="w-full border border-gray-300 p-3 rounded-lg appearance-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 pr-10 bg-white"
        >
          <option value={0}>{t("Select currency")}</option>
          {currencies.map((curr) => (
            <option key={curr.id} value={curr.id}>
              {curr.code}
            </option>
          ))}
        </select>
        {errors.currency && (
          <p className="text-red-500 text-xs mt-1">{errors.currency.message}</p>
        )}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>

      {/* Reference Type Select */}
      <div className="relative">
        <label
          htmlFor="reference_type"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <UserCheck className="inline-block mr-1 h-4 w-4 text-gray-500" />
          {t("Reference")}
        </label>
        <select
          id="reference_type"
          {...register("reference_type", {
            onChange: (e) =>
              setLocalReferenceType(
                e.target.value as "employee" | "expense_category"
              ),
          })}
          className="w-full border border-gray-300 p-3 rounded-lg appearance-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 pr-10 bg-white"
        >
          <option value="employee">{t("Employee")}</option>
          <option value="expense_category">{t("Expense Category")}</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>

      {/* Reference Name Select */}
      <div className="relative">
        <label
          htmlFor="reference_id"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <User className="inline-block mr-1 h-4 w-4 text-gray-500" />
          {t("Reference Name")}
        </label>
        <select
          id="reference_id"
          {...register("reference_id", { valueAsNumber: true })}
          className="w-full border border-gray-300 p-3 rounded-lg appearance-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 pr-10 bg-white"
        >
          <option value={0}>
            {t("Select")}{" "}
            {localReferenceType === "employee"
              ? t("Employee")
              : t("Expense Category")}
          </option>
          {getReferenceOptions().map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        {errors.reference_id && (
          <p className="text-red-500 text-xs mt-1">
            {errors.reference_id.message}
          </p>
        )}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>

      {/* Start Date */}
      <div>
        <label
          htmlFor="start_date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <Calendar className="inline-block mr-1 h-4 w-4 text-gray-500" />
          {t("Start Date")}
        </label>
        <input
          type="date"
          id="start_date"
          {...register("start_date")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.start_date && (
          <p className="text-red-500 text-xs mt-1">
            {errors.start_date.message}
          </p>
        )}
      </div>

      {/* End Date */}
      <div>
        <label
          htmlFor="end_date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <Calendar className="inline-block mr-1 h-4 w-4 text-gray-500" />
          {t("End Date (Optional)")}
        </label>
        <input
          type="date"
          id="end_date"
          {...register("end_date")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        />
      </div>

      {/* Description */}
      <div className="sm:col-span-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          <FileText className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
          {t("Description (Optional)")}
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          placeholder={t("e.g., Monthly salary for employees")}
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="sm:col-span-2 py-2 w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-bold rounded-lg shadow-md hover:from-blue-600 hover:to-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {initialData ? t("Updating...") : t("Adding...")}
          </div>
        ) : initialData ? (
          t("Update Payment")
        ) : (
          t("Add Monthly Payment")
        )}
      </button>
    </form>
  );
}
