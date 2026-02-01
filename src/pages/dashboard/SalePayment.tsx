import { useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import Badge from "../../components/Badge";
import Input from "../../components/Input";
import ReceiptView from "../../components/ReceiptView";
import type { SalePaymentData } from "../../entities/SalePayment";
import { useCartStore, useCurrencyStore } from "../../stores";
import { useCashDrawerStore } from "../../stores/useCashDrawerStore";
import { cartToReceipt } from "../../utils/cartToReceipt";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import RouteBox from "../../components/RouteBox";
import { useTranslation } from "react-i18next";
import { useUserProfileStore } from "../../stores/useUserStore";
import { extractAxiosError } from "../../utils/extractError";
import { roundWithPrecision } from "../../utils/roundWithPrecision";
import { updateInventoryItemFieldEverywhere } from "../../queries/inventoryUpdater";
import { useInventory } from "../../hooks/inventory/useInventory";

function SalePayment() {
  const { t } = useTranslation();
  const {
    id,
    items,
    payments,
    sale_date,
    discount_amount,
    notes,
    subtotalCurrencyId,
    customer,

    addPayment,
    deletePayment,
    setNotes,
    getFinalAmount,
    getSubtotal,
    setSaleDate,
    getItemTotalAmount,
    getTotalAmount,
    addToCustomerAccount,
    clearCustomerAccount,
    submitSale,
    clearStore,
  } = useCartStore();

  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  const getCurrencyOptions = useCurrencyStore((s) => s.getCurrencyOptions);
  const getBaseCurrency = useCurrencyStore((s) => s.getBaseCurrency);
  const convertCurrency = useCurrencyStore((s) => s.convertCurrency);

  const cashDrawers = useCashDrawerStore((s) => s.cashDrawers);
  const baseCurrency = getBaseCurrency();
  const finalAmount = getFinalAmount();

  const defaults = {
    amount: finalAmount,
    cash_drawer: cashDrawers[0].id,
    currency: subtotalCurrencyId,
  } as SalePaymentData;
  const [tender, setTender] = useState<Omit<SalePaymentData, "id">>(defaults);
  const subtotal = getSubtotal();
  const totalAmount = getTotalAmount();
  const contentRef = useRef<HTMLDivElement>(null);
  const { items: inventory_items } = useInventory();
  const navigate = useNavigate();

  const handleComplete = async () => {
    // PRE‑SUBMIT VALIDATION

    try {
      const sale = await submitSale();
      toast.success(`Sale Successfully Created: ${sale.receipt_id}`);
      // toast.success(`${t("✅ Sale Successfully Created:")} ${sale.receipt_id}`);
      items.map((item) => {
        const inventory_item = inventory_items.find(
          (i) => i.id === item.inventory
        );
        if (!inventory_item) return;
        updateInventoryItemFieldEverywhere(
          item.inventory,
          "quantity_on_hand",
          (
            parseFloat(inventory_item.quantity_on_hand) - item.quantity
          ).toString()
        );
      });
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      extractAxiosError(err, "Failed to submit sale");
    }
  };
  const user = useUserProfileStore((s) => s.userProfile);
  const fullName = user?.firstName + " " + user?.lastName;
  const confirmSubmit = async (callBack?: () => void) => {
    if (items.length === 0) {
      toast.error(t("No items in the cart to complete the sale"));
      return;
    }
    if (finalAmount > 0) {
      toast(t("You still owe") + finalAmount.toFixed(2), {
        icon: "⚠️",
      });
      return;
    }

    await handleComplete();
    callBack?.();
    clearStore();
  };
  const routebox = [{ path: "/sale-payment", name: t("Sale Payment") }];
  const reactToPrintFn = useReactToPrint({ contentRef });
  return (
    <>
      <RouteBox items={routebox} routlength={routebox.length} />
      <div className="flex flex-col md:flex-row gap-2 p-4 md:h-dvh">
        <div className="flex-1 border-e p-1 border-border-color h-full overflow-y-auto">
          <p className="text-2xl mb-3 text-center font-bold text-secondary-front">
            {t("Payments")}
          </p>
          <label>{t("Pay")}</label>
          <Input
            type="number"
            value={tender.amount}
            onChange={(value) =>
              setTender({ ...tender, amount: parseFloat(value) })
            }
            rightElements={[
              {
                type: "dropdown",
                options: getCurrencyOptions(),
                default: tender.currency,
                onChange(value) {
                  setTender({ ...tender, currency: parseInt(value) });
                },
              },
              {
                type: "dropdown",
                default: tender.cash_drawer,
                options: cashDrawers.map((c) => ({
                  key: c.id,
                  value: c.name,
                })),
                onChange(value) {
                  setTender({ ...tender, cash_drawer: parseInt(value) });
                },
              },
              {
                type: "button",
                text: t("Pay"),
                onClick() {
                  if (tender.amount > 0) {
                    addPayment(tender);
                    setTender((prev) => ({
                      ...prev,
                      amount: roundWithPrecision(
                        convertCurrency(
                          getFinalAmount(),
                          subtotalCurrencyId,
                          tender.currency
                        ),
                        3
                      ),
                      currency: subtotalCurrencyId,
                    }));
                  }
                },
              },
            ]}
          ></Input>
          <div className="p-2 mt-3 gap-2 flex flex-wrap">
            {payments.map((pay) => (
              <Badge key={pay.id}>
                <div dir="ltr" className="py-0.5 flex">
                  <div className="px-2">
                    {formatPriceWithCurrency(pay.amount, pay.currency)}
                  </div>
                  <button
                    onClick={() => {
                      deletePayment(pay.id);
                      setTender((prev) => ({
                        ...prev,
                        amount: roundWithPrecision(
                          convertCurrency(
                            getFinalAmount(),
                            subtotalCurrencyId,
                            tender.currency
                          ),
                          3
                        ),
                        currency: subtotalCurrencyId,
                      }));
                    }}
                  >
                    <FaTimes className="ps-2 inline text-lg text-error-front"></FaTimes>
                  </button>
                </div>
              </Badge>
            ))}
          </div>
          <div>
            <br />
            <br />
            <div className="text-xl border-b px-4 border-indigo mb-3 flex justify-between">
              <span>{t("Total Amount")}</span>
              <span dir="ltr">
                {formatPriceWithCurrency(totalAmount, subtotalCurrencyId)}
              </span>
            </div>
            <div className="text-xl border-b px-4 border-indigo mb-3 flex justify-between">
              <span>{t("Remaining")}</span>
              <span dir="ltr">
                {formatPriceWithCurrency(finalAmount, subtotalCurrencyId)}
              </span>
            </div>
            <br />

            {/* Customer */}
            {customer && (
              <div>
                <button
                  disabled={finalAmount === 0}
                  onClick={() => {
                    console.log(finalAmount);
                    addToCustomerAccount(finalAmount);
                  }}
                  className={`p-2 w-full bg-teal
                  text-gray-100 transition-colors duration-200
                  rounded-sm ${
                    finalAmount === 0 ? "opacity-50" : "hover:bg-teal-hover"
                  }`}
                >
                  {t("Add To Account")}
                </button>
                <br />
                <br />
                <p className="text-lg font-bold mb-3">
                  {t("Customer Balance")}
                </p>
                <div className="flex px-2">
                  <div className="flex-1">
                    <p>{t("Current Balance")}</p>
                    <p>
                      <span dir="ltr">
                        {formatPriceWithCurrency(
                          parseFloat(customer.balance),
                          baseCurrency.id
                        )}
                      </span>
                    </p>
                  </div>
                  <div className="flex-1">
                    <p>{t("New Balance")}</p>
                    <p>
                      <span dir="ltr">
                        {formatPriceWithCurrency(
                          parseFloat(customer.balance) -
                            (customer.added_to_account || 0),
                          baseCurrency.id
                        )}
                      </span>
                    </p>
                  </div>
                </div>
                {customer.added_to_account && (
                  <p className="flex flex-wrap mt-2">
                    <Badge color="yellow">
                      <div className="py-0.5 flex">
                        <p>{t("Added to Account:")}</p>
                        <div dir="ltr" className="px-2">
                          {formatPriceWithCurrency(
                            convertCurrency(
                              customer.added_to_account,
                              baseCurrency.id,
                              subtotalCurrencyId
                            ),
                            subtotalCurrencyId
                          )}
                        </div>
                        <button onClick={() => clearCustomerAccount()}>
                          <FaTimes className="ps-2 inline text-lg text-error-front"></FaTimes>
                        </button>
                      </div>
                    </Badge>
                  </p>
                )}
                <hr className="text-border-color my-2" />
                <br />
              </div>
            )}
          </div>
          <div className="mb-3">
            <label>{t("Change Date")}</label>
            <Input type="date" onChange={(val) => setSaleDate(val)}></Input>
          </div>
          <div>
            <label className="text-lg">{t("Reciept Notes")}</label>
            <Input
              type="textarea"
              value={notes}
              onChange={(value) => setNotes(value)}
            />
          </div>
          <br />
          <div className="flex space-x-1">
            <button
              onClick={() => confirmSubmit()}
              disabled={finalAmount > 0}
              className={`p-2 flex-1 text-white transition-colors duration-200 rounded-sm ${
                finalAmount > 0
                  ? "bg-success/75 cursor-not-allowed"
                  : "bg-success hover:bg-success-hover"
              }`}
            >
              {t("Save")}
            </button>
            <button
              onClick={() => {
                confirmSubmit(reactToPrintFn);
              }}
              disabled={finalAmount > 0}
              className={`p-2 flex-1 text-white transition-colors duration-200 rounded-sm ${
                finalAmount > 0
                  ? "bg-emerald-500/75 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-700"
              }`}
            >
              {t("Save/Print")}
            </button>
          </div>
          <br />
          <br />
        </div>
        <div className="flex-1 h-full overflow-y-auto">
          <div className="border border-border-color">
            <ReceiptView
              ref={contentRef}
              receipt={{
                id: id,
                receipt_id: String(id),
                discount_amount: formatPriceWithCurrency(
                  discount_amount,
                  subtotalCurrencyId
                ),
                currency: subtotalCurrencyId,
                status: "processed",
                customer: customer,
                sale_date: sale_date?.toISOString() || new Date().toISOString(),
                user: fullName,
                type: "Cash",
                items: items.map((item) =>
                  cartToReceipt(item, getItemTotalAmount)
                ),
                subtotal: formatPriceWithCurrency(subtotal, subtotalCurrencyId),
                total_amount: formatPriceWithCurrency(
                  totalAmount,
                  subtotalCurrencyId
                ),
                item_count: items.length,
                tenders: payments,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SalePayment;
