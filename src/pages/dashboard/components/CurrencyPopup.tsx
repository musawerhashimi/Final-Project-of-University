import { useState } from "react";
import Input from "../../../components/Input";
import Popup from "../../../components/Popup";
import { useCurrencyStore } from "../../../stores";
import { toast } from "sonner";
import { useCan } from "../../../hooks/useCan";
import { useTranslation } from "react-i18next";
interface Props {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}

function CurrencyPopup({ isOpen, setOpen }: Props) {
  const currencies = useCurrencyStore((s) => s.currencies);
  const updateCurrency = useCurrencyStore((s) => s.updateCurrency);
  const { t } = useTranslation();
  const [dummyCurrencies, setDummyCurrencies] = useState(
    currencies.filter((c) => !c.is_base_currency)
  );
  const allowed = useCan("purchases");

  return (
    <Popup isOpen={isOpen} setOpen={setOpen}>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 w-80  ">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("Currency Exchange Rates")}
          </h3>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="border-b border-gray-200 dark:border-gray-600 mb-4" />

        {/* Currency List */}
        <div className="h-[380px] overflow-auto">
          {dummyCurrencies.length > 0 ? (
            dummyCurrencies.map((currency, index) => (
              <div
                key={currency.id}
                className={` p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  index !== dummyCurrencies.length - 1 ? "mb-2" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currency.code}
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {t("Exchange Rate")}
                  </span>
                </div>

                <Input
                  value={currency.exchange_rate}
                  type="number"
                  step={0.01}
                  min={0}
                  disabled={!allowed}
                  placeholder={t("Enter exchange rate")}
                  onChange={(value) =>
                    setDummyCurrencies((prev) =>
                      prev.map((p) =>
                        p.id === currency.id
                          ? { ...p, exchange_rate: value }
                          : p
                      )
                    )
                  }
                  rightElements={[
                    {
                      type: "button",
                      text: t("Set"),
                      disabled:
                        !allowed ||
                        !currency.exchange_rate ||
                        Number(currency.exchange_rate) <= 0,
                      className: `px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        !allowed ||
                        !currency.exchange_rate ||
                        Number(currency.exchange_rate) <= 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-sky-500 text-white"
                      }`,
                      async onClick() {
                        try {
                          const { error } = await updateCurrency(
                            currency.id,
                            currency
                          );
                          if (error) {
                            toast.error(
                              `${t("Failed to update")} ${
                                currency.code
                              }: ${error}`
                            );
                            setDummyCurrencies(
                              currencies.filter((c) => !c.is_base_currency)
                            );
                            return;
                          }
                          toast.success(
                            `${currency.code} ${t(
                              "exchange rate updated successfully!"
                            )}`
                          );
                        } catch (err) {
                          toast.error(
                            `${t("Unexpected error updating")} ${currency.code}`
                          );
                          setDummyCurrencies(
                            currencies.filter((c) => !c.is_base_currency)
                          );
                        }
                      },
                    },
                  ]}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <svg
                  className="w-8 h-8 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("No additional currencies available")}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!allowed && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              {t("You don't have permission to update exchange rates")}
            </p>
          </div>
        )}
      </div>
    </Popup>
  );
}

export default CurrencyPopup;
