import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { apiClient } from "../../../../../lib/api"; // Adjust path as needed
import {
  paymentReceiveSchema,
  type PaymentReceiveFormData,
} from "../../../../../schemas/paymentReceiveSchema";
import { useCashDrawerStore } from "../../../../../stores/useCashDrawerStore";
import { useCurrencyStore } from "../../../../../stores";
import { useTranslation } from "react-i18next";

interface Props {
  initialData?: PaymentReceiveFormData | null;
  onSubmit: (data: PaymentReceiveFormData) => void;
}

interface Party {
  id: number;
  name: string;
}

interface PartiesResponse {
  vendors: Party[];
  customers: Party[];
  employees: Party[];
  members: Party[];
}

export default function PaymentReceiveForm({ initialData, onSubmit }: Props) {
  const { t } = useTranslation();
  // Local state to manage selected party type
  const [localCategory, setLocalCategory] = useState(
    initialData?.party_type || "employees"
  );

  // Fetch parties data from API
  const {
    data: partiesData,
    isLoading,
    error,
  } = useQuery<PartiesResponse>({
    queryKey: ["parties"],
    queryFn: async () => {
      const response = await apiClient.get("/finance/transactions/parties");
      return response.data;
    },
  });

  const getOptions = () => {
    if (!partiesData) return [];
    switch (localCategory) {
      case "employees":
        return partiesData.employees || [];
      case "members":
        return partiesData.members || [];
      case "customers":
        return partiesData.customers || [];
      case "vendors":
        return partiesData.vendors || [];
      default:
        return [];
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentReceiveFormData>({
    resolver: zodResolver(paymentReceiveSchema),
    defaultValues: initialData || {
      amount: 0,
      currency: 0,
      party_type: "employees",
      party_id: 0,
      cash_drawer_id: 0,
      transaction_type: "pay",
      description: "",
    },
  });
  const getBaseCurrency = useCurrencyStore((s) => s.getBaseCurrency);
  const cashDrawers = useCashDrawerStore((s) => s.cashDrawers);
  const currencies = useCurrencyStore((s) => s.currencies);

  useEffect(() => {
    reset(
      initialData || {
        amount: 0,
        currency: getBaseCurrency().id,
        party_type: "employees",
        party_id: 0,
        cash_drawer_id: cashDrawers[0].id,
        transaction_type: "pay",
        description: "",
      }
    );
    setLocalCategory(initialData?.party_type || "employees");
  }, [cashDrawers, getBaseCurrency, initialData, reset]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">
          {t("Error loading data. Please try again.")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <div>
        <label className="font-medium">{t("Amount")}</label>
        <input
          type="number"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm">{errors.amount.message}</p>
        )}
      </div>
      <div>
        <label className="font-medium">{t("Currency")}</label>
        <select
          {...register("currency", { valueAsNumber: true })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">{t("Select Currency")}</option>
          {currencies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code}
            </option>
          ))}
          {/* Add more currencies as needed */}
        </select>
        {errors.currency && (
          <p className="text-red-500 text-sm">{errors.currency.message}</p>
        )}
      </div>
      <div>
        <label className="font-medium">{t("Transaction Category")}</label>
        <select
          {...register("party_type", {
            onChange: (e) => setLocalCategory(e.target.value),
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="employees">{t("Employees")}</option>
          <option value="members">{t("Members")}</option>
          <option value="customers">{t("Customers")}</option>
          <option value="vendors">{t("Vendors")}</option>
        </select>
      </div>
      <div>
        <label className="font-medium">{t("Transaction Name")}</label>
        <select
          {...register("party_id", { valueAsNumber: true })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">
            {t("Select")} {localCategory}
          </option>
          {getOptions().map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        {errors.party_id && (
          <p className="text-red-500 text-sm">{errors.party_id.message}</p>
        )}
      </div>
      <div>
        <label className="font-medium">{t("Resources")}</label>
        <select
          {...register("cash_drawer_id", { valueAsNumber: true })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">{t("Select Resources")}</option>
          {cashDrawers.map((cd) => (
            <option key={cd.id} value={cd.id}>
              {cd.name}
            </option>
          ))}
          {/* Add more resources as needed */}
        </select>
      </div>
      <div>
        <label className="font-medium">{t("Pay/Receive")}</label>
        <select
          {...register("transaction_type")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="pay">{t("Pay")}</option>
          <option value="receive">{t("Receive")}</option>
        </select>
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
      <button
        type="submit"
        className="sm:col-span-2 cursor-pointer bg-green-700 hover:bg-green-600 transition-colors duration-200 text-white rounded py-2 font-bold"
      >
        {t("Submit")}
      </button>
    </form>
  );
}
