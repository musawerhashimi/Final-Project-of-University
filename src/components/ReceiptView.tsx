import { forwardRef } from "react";
import type { Receipt } from "../entities/Receipt";
import Logo from "./Logo";
import { useDirection } from "../hooks/useDirection";
import { useCurrencyStore } from "../stores";
import Badge from "./Badge";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useTranslation } from "react-i18next";
import { formatLocalDateTime } from "../utils/formatLocalDateTime";

interface ReceiptViewProps {
  receipt: Receipt;
}

const ReceiptView = forwardRef<HTMLDivElement, ReceiptViewProps>(
  ({ receipt }, ref) => {
    const logoUrl = useSettingsStore((s) => s.logoSettings?.logo);
    const shopSettings = useSettingsStore((s) => s.shopSettings);
    const direc = useDirection();
    const formatPriceWithCurrency = useCurrencyStore(
      (s) => s.formatPriceWithCurrency
    );
    const getBaseCurrency = useCurrencyStore((s) => s.getBaseCurrency);
    const baseCurrency = getBaseCurrency();
    const { t } = useTranslation();
    const receiptDate = new Date(receipt.sale_date);
    return (
      <div className="p-4" ref={ref} dir={direc}>
        <Logo src={logoUrl || undefined}>{shopSettings?.shop_name}</Logo> <br />
        <div className="inline-flex align-items-center justify-content-center gap-2">
          {t("Customer Name:")}
          {receipt.customer ? (
            <span className="font-bold white-space-nowrap">
              {receipt.customer.name}
            </span>
          ) : (
            <span className="font-bold white-space-nowrap">{t("Unknown")}</span>
          )}
        </div>
        <p>
          {t("Receipt Id:")}

          <span className="font-bold">{receipt.receipt_id}</span>
        </p>
        <p>
          {t("Dat")}{" "}
          <span className="font-bold">
            {formatLocalDateTime(receipt.sale_date)}
          </span>
        </p>
        <p>
          {" "}
          {t("Print By:")} {receipt.user}
        </p>
        <hr className="border-2 border-gray-300" />
        <div className="mt-4 space-y-1 text-sm   ">
          <table className=" w-full ">
            <tr className="border-2 border-gray-300">
              <th className="border-2 border-gray-300">{t("Items")}</th>
              <th className="border-2 border-gray-300">{t("Qty")}</th>
              <th className="border-2 border-gray-300">{t("Price")}</th>
              <th className="border-2 border-gray-300">{t("Disc")}</th>
              <th className="border-2 border-gray-300">{t("Subtotal")}</th>
            </tr>
            {receipt.items.map((item, idx) => (
              <tr key={idx} className="border-2">
                <td className="border-2 border-gray-300 text-center">
                  {item.name}
                </td>
                <td className="border-2 border-gray-300 text-center">
                  {item.quantity}
                </td>
                <td className="border-2 border-gray-300 text-center">
                  {formatPriceWithCurrency(item.price, receipt.currency)}
                </td>
                <td className="border-2 border-gray-300 text-center">
                  {formatPriceWithCurrency(
                    Number(item.discount),
                    receipt.currency
                  )}
                </td>
                <td className="border-2 border-gray-300 text-center">
                  {formatPriceWithCurrency(item.subtotal, receipt.currency)}
                </td>
              </tr>
            ))}
          </table>
        </div>
        <table className="w-full mt-3 text-sm">
          <tr className="border-t-2 border-gray-300">
            <th className="text-start">{t("Subtotal")}</th>
            <td className="text-end">
              <span>
                {formatPriceWithCurrency(
                  parseFloat(receipt.subtotal),
                  receipt.currency
                )}
              </span>
            </td>
          </tr>
          <tr className="border-t-2 border-gray-300">
            <th className="text-start">{t("Discount")}</th>
            <td className="text-end">
              <span>
                {formatPriceWithCurrency(
                  parseFloat(receipt.discount_amount),
                  receipt.currency
                )}
              </span>
            </td>
          </tr>
          <tr className="border-t-2 border-gray-300 ">
            <th className="text-start text-xl">{t("Total")}</th>
            <td className="text-end text-xl font-bold">
              <span>
                {formatPriceWithCurrency(
                  parseFloat(receipt.total_amount),
                  receipt.currency
                )}
              </span>
            </td>
          </tr>
          <tr className="border-t-2 border-gray-300">
            <th className="text-start">{t("Item Count")}</th>
            <td className="text-end">{receipt.item_count}</td>
          </tr>
          <tr className="border-t-2 border-gray-300">
            <th className="text-start">{t("Tender")}</th>
            <td className="text-end">
              {receipt.tenders.map((tender) => (
                <span className="mx-0.5" key={tender.id}>
                  <Badge>
                    {formatPriceWithCurrency(tender.amount, tender.currency)}
                  </Badge>
                </span>
              ))}
            </td>
          </tr>

          {receipt.customer && (
            <>
              <tr className="border-t-2 border-gray-300">
                <th className="text-start">{t("Current Balance")}</th>
                <td className="text-end">
                  <span>
                    {formatPriceWithCurrency(
                      parseFloat(receipt.customer.balance),
                      baseCurrency.id
                    )}
                  </span>
                </td>
              </tr>
              <tr className="border-t-2 border-gray-300">
                <th className="text-start">{t("Added To Account")}</th>
                <td className="text-end">
                  <span>
                    {receipt.customer.added_to_account &&
                      formatPriceWithCurrency(
                        receipt.customer.added_to_account,
                        baseCurrency.id
                      )}
                  </span>
                </td>
              </tr>
              <tr className="border-t-2 border-gray-300">
                <th className="text-start">{t("New Balance")}</th>
                <td className="text-end">
                  <span>
                    {formatPriceWithCurrency(
                      parseFloat(receipt.customer.balance) -
                        (receipt.customer.added_to_account || 0),
                      baseCurrency.id
                    )}
                  </span>
                </td>
              </tr>
            </>
          )}
        </table>
        <div className="mt-4 flex flex-col space-y-2 text-center">
          <p className="text-2xl font-semibold mb-3">
            {shopSettings?.shop_name}
          </p>
          <p>
            {t("Address:")} {shopSettings?.address}
          </p>
          <p>
            {t("Phone:")} {shopSettings?.phone_number}
          </p>
          <p>
            {t("Email:")} {shopSettings?.contact_email}
          </p>
        </div>
      </div>
    );
  }
);

export default ReceiptView;
