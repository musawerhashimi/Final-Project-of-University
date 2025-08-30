import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, Tag, Edit, XCircle } from "lucide-react";
import { FaCode } from "react-icons/fa";
import RouteBox from "../../../components/RouteBox";
import { useCurrencyStore } from "../../../stores";
import {
  currencySchema,
  type CurrencyFormData,
} from "../../../schemas/currencyValidation";
import type { Currency } from "../../../entities/Currency";
import { Button } from "primereact/button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const MyCurrency = () => {
  const { t } = useTranslation();
  const routename = [
    { path: "/tools", name: t("Tools") },
    { path: "", name: t("Currency") },
  ];

  const { currencies, createCurrency, updateCurrency, loading, error } =
    useCurrencyStore();

  const [editingCurrencyId, setEditingCurrencyId] = useState<number | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CurrencyFormData>({
    resolver: zodResolver(currencySchema),
  });

  const onSubmit = (data: CurrencyFormData) => {
    if (editingCurrencyId !== null) {
      updateCurrency(editingCurrencyId, data).then(() => {
        if (error) {
          toast.error(error);
          return;
        }
        toast.success(t("Currency Updated Successfully!"));
      });
      setEditingCurrencyId(null);
    } else {
      createCurrency(data).then(() => {
        if (error) {
          toast.error(error);
          return;
        }
        toast.success(t("Currency Created Successfully!"));
      });
    }
    reset();
  };

  const handleEdit = (currency: Currency) => {
    setEditingCurrencyId(currency.id);
    setValue("name", currency.name);
    setValue("code", currency.code);
    setValue("symbol", currency.symbol);
    setValue("exchange_rate", String(currency.exchange_rate));
  };

  return (
    <>
      <RouteBox items={routename} routlength={routename.length} />
      <div className="mt-[-15px] bg-gradient-to-br from-blue-100 to-purple-100 p-4  flex flex-col items-center">
        <div className="w-full bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {editingCurrencyId ? t("Edit Currency") : t("Add New Currency")}
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
                {t("Currency Name")}
              </label>
              <input
                {...register("name")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t("e.g., Afghani, Dollar, Euro")}
              />

              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaCode className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
                {t("Code")}
              </label>
              <input
                {...register("code")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., USD, AFG, PK"
              />
              {errors.code && (
                <p className="text-red-500 text-sm">{errors.code.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Tag className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
                {t("Symbol")}
              </label>
              <input
                {...register("symbol")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., $, Rs, €"
              />
              {errors.symbol && (
                <p className="text-red-500 text-sm">{errors.symbol.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline-block mr-1 h-4 w-4 text-gray-500" />{" "}
                {t("Exchange Rate")}
              </label>
              <input
                {...register("exchange_rate")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 68.12"
              />
              {errors.exchange_rate && (
                <p className="text-red-500 text-sm">
                  {errors.exchange_rate.message}
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              <div className="flex-1">
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  label={
                    editingCurrencyId
                      ? t("Update Currency")
                      : t("Add New Currency")
                  }
                />
              </div>

              {editingCurrencyId && (
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setEditingCurrencyId(null);
                  }}
                  className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <XCircle className="inline-block mr-2 h-5 w-5" />{" "}
                  {t("Cancel Edit")}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="w-full bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {t("Available Currencies")}
          </h2>
          {currencies.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              {t("No currencies added yet.")}
            </p>
          ) : (
            <div className="space-y-4">
              {currencies.map((currency) => (
                <div
                  key={currency.id}
                  className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-md shadow-sm border-1 border-gray-200"
                >
                  <div className="flex items-center flex-grow w-full">
                    <div className="flex-shrink-0 mr-4">
                      <span className="flex items-center justify-center h-12 w-12 rounded-full bg-sky-200 text-red-500 text-2xl font-bold">
                        {currency.symbol}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-gray-700">
                        {currency.name}
                      </div>
                      <div className="font-bold text-lg text-blue-500">
                        {currency.code} {currency.exchange_rate}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3 sm:mt-0">
                    <button
                      onClick={() => handleEdit(currency)}
                      className="p-2 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      title={t("Edit Currency")}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyCurrency;
