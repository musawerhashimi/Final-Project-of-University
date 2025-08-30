import ReceiptCard from "./ReceiptCard";
import { useState } from "react";
import { useReceipts } from "../../../queries/useReceipts"; // adjust path
import CircleAnimation from "../../../components/animation";
import { useTranslation } from "react-i18next";

function ReceiptList() {
  const { t } = useTranslation();
  const [showUnprocessed, setShowUnprocessed] = useState(false);
  const [showLoan, setShowLoan] = useState(false);
  const [showCash, setShowCash] = useState(false);
  const [scanSession, setScanSession] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const { data: receipts = [], isLoading, isError } = useReceipts();

  const filteredReceipts = receipts.filter((r) => {
    if (showUnprocessed && r.status !== "Unprocessed") return false;
    if (showLoan && r.type !== "Loan") return false;
    if (showCash && r.type !== "Cash") return false;
    if (scanSession && !r.receipt_id.includes(scanSession)) return false;

    if (filterDate) {
      const receiptDate = new Date(r.sale_date);
      const formattedReceiptDate = receiptDate
        .toLocaleDateString("en-GB") // Formats as DD/MM/YYYY
        .replace(/\//g, "-"); // Optional: if you want 01-03-2025 instead

      const selectedDate = new Date(filterDate);
      const formattedSelectedDate = selectedDate
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");

      if (formattedReceiptDate !== formattedSelectedDate) return false;
    }

    return true;
  });

  if (isLoading)
    return (
      <div className="p-4">
        <CircleAnimation />
      </div>
    );

  if (isError)
    return (
      <div className="text-red-600 p-4">{t("Failed to load receipts.")}</div>
    );

  return (
    <>
      {/* {---------Part of Toolbar---------------} */}

      <div className="p-4 shadow-sm mb-4 ">
        <div className="flex flex-wrap gap-2 items-center ">
          <input
            type="text"
            placeholder={t("Scan Session Number")}
            value={scanSession}
            onChange={(e) => setScanSession(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 inline w-70   p-2.5 "
          />

          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  inline w-70  p-2.5 "
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />

          <p className="p-2 font-bold  ">{t("Show Unprocessed")}</p>
          <input
            type="checkbox"
            id="show-unprocessed"
            checked={showUnprocessed}
            onChange={(e) => setShowUnprocessed(e.target.checked)}
            className=" w-6 h-6 "
          />

          <p className="p-2  font-bold ">{t("Loan")}</p>
          <input
            type="checkbox"
            checked={showLoan}
            onChange={(e) => setShowLoan(e.target.checked)}
            className="w-6 h-6 "
          />

          <p className="p-2  font-bold  ">{t("Cash")}</p>
          <input
            type="checkbox"
            checked={showCash}
            onChange={(e) => setShowCash(e.target.checked)}
            className="w-6 h-6 "
          />
        </div>
      </div>

      {/* {----------Part of Receipt Card --------------} */}
      {filteredReceipts.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          {t("No receipts found matching the criteria.")}
        </div>
      )}
      <div className="p-2 flex flex-wrap justify-center-safe gap-2">
        {filteredReceipts.map((r) => (
          <ReceiptCard key={r.id} {...r} />
        ))}
      </div>
    </>
  );
}

export default ReceiptList;
