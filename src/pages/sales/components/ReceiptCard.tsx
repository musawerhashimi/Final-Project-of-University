import type { Receipt } from "../../../entities/Receipt";
import { Button } from "primereact/button";
import { useState } from "react";
import ReceiptDialog from "./ReceiptDialog";
import { useCurrencyStore } from "../../../stores";
import { formatLocalDateTime } from "../../../utils/formatLocalDateTime";
import { useTranslation } from "react-i18next";

function ReceiptCard(props: Receipt) {
  const { t } = useTranslation();
  const {
    receipt_id: reciept_id,
    sale_date,
    status,
    items,
    total_amount,
    currency,
    type,
    customer,
  } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const getCurrency = useCurrencyStore((s) => s.getCurrency);
  return (
    <div className="rounded-xl shadow-md dark:shadow-lg p-3 w-43 bg-receipt text-receipt-front hover:shadow-xl transition-all duration-400 border-1 hover:border-blue-400">
      {customer ? (
        <div className="text-center text-sm font-semibold mb-2">
          {customer.name}
        </div>
      ) : (
        <div className="text-center text-sm font-semibold mb-2">{t("N/A")}</div>
      )}
      <div className="text-left text-xs text-gray-500">
        {formatLocalDateTime(sale_date)}
      </div>
      <div className="text-left text-blue-600 text-xs mb-2">#{reciept_id}</div>
      <div
        className={`text-xs font-semibold text-white rounded px-2 py-1 inline-block me-1 ${
          type === "Cash" ? "bg-green-500" : "bg-yellow-500"
        }`}
      >
        {type}
      </div>
      <div
        className={`text-xs font-semibold text-white rounded px-2 py-1 inline-block ${
          status === "Processed" ? "bg-green-500" : "bg-yellow-500"
        }`}
      >
        {status}
      </div>
      <div className="overflow-y-auto h-20 mt-3 space-y-1 text-sm w-full rounded-sm  p-2 ">
        <table className="w-full">
          <tr className="border-b-2 border-gray-400">
            <th className="text-start "># {t("Items")}</th>
            <th className="text-end ">{t("Qty")}</th>
          </tr>
          {items.map((item, idx) => (
            <tr key={idx} className="border-b-1 border-gray-400">
              <td className="text-start">{item.name}</td>
              <td className="text-end">{item.quantity}</td>
            </tr>
          ))}
        </table>
      </div>
      <div className="text-left border-t-2 my-2 font-bold">
        {total_amount} {getCurrency(currency).code}
      </div>

      <div className="relative mt-10 text-sm font-semibold">
        <div className="absolute  bottom-0">
          {/* <button className=" bg-error hover:bg-red-700 text-white  p-1 rounded-sm transition-colors duration-300">
            {t("Delete")}
          </button> */}
          {/* <div className="ms-1 inline-block"></div> */}
          <Button
            className=" bg-success hover:bg-green-600 text-white  p-1 rounded-sm transition-colors duration-300"
            label={t("Read more")}
            icon="pi pi-external-link"
            onClick={() => setVisible(true)}
          />
          <ReceiptDialog
            visible={visible}
            onHide={() => setVisible(false)}
            receipt={props}
          />
        </div>
      </div>
    </div>
  );
}

export default ReceiptCard;
