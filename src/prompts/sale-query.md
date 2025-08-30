import type { SaleCustomer } from "./SaleCustomer";
import type { SalePaymentData } from "./SalePayment";

export type ReceiptItem = {
  name: string;
  quantity: number;
  price: number;
  currency: number;
  discount?: number;
  discountCurrency: number;
  subtotal: number;
};

export type Receipt = {
  id: number;
  date: string;
  user: string | null;
  type: string;
  status: string;
  items: ReceiptItem[];
  discount: string;
  print_by: string;
  subtotal: string;
  item_count: number;
  total: string;
  tenders: SalePaymentData[];
  customer?: SaleCustomer;
};

data comes in this shape: Receipt[]

this is to list them:
import ReceiptCard from "./ReceiptCard";
import receipt from "../../../data/receipt";
import { useState } from "react";


function ReceiptList() {
  const [showUnprocessed, setShowUnprocessed] = useState(false);
  const [showLoan, setShowLoan] = useState(false);
  const [showCash, setShowCash] = useState(false);
  const [scanSession, setScanSession] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const filteredReceipts = receipt.filter((r) => {
    // Filter by status
    if (showUnprocessed && r.status !== "Unprocessed") return false;
    if (showLoan && r.type !== "Loan") return false;
    if (showCash && r.type !== "Cash") return false;
    // Filter by scan session (id)
    if (scanSession && !r.id.toString().includes(scanSession)) return false;
    // Filter by date (exact match)
    if (filterDate && !r.date.startsWith(filterDate)) return false;
    return true;
  });
  return (
    <>
      {/* {---------Part of Toolbar---------------} */}

      <div className="p-4 shadow-sm mb-4 ">
        <div className="flex flex-wrap gap-2 items-center ">
          <input
            type="text"
            placeholder="Scan Session"
            value={scanSession}
            onChange={(e) => setScanSession(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 inline w-70   p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />

          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  inline w-70  p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />

          <p className="p-2 font-bold  ">Show Unprocessed</p>
          <input
            type="checkbox"
            id="show-unprocessed"
            checked={showUnprocessed}
            onChange={(e) => setShowUnprocessed(e.target.checked)}
            className=" w-6 h-6 "
          />

          <p className="p-2  font-bold ">Show All</p>
          <input
            type="checkbox"
            // id="show-unprocessed"
            // checked={showUnprocessed}
            // onChange={(e) = > setShowUnprocessed(e.target.checked)}
            className="w-6 h-6"
          />

          <p className="p-2  font-bold ">Loan</p>
          <input
            type="checkbox"
            checked={showLoan}
            onChange={(e) => setShowLoan(e.target.checked)}
            className="w-6 h-6 "
          />

          <p className="p-2  font-bold  ">Cash</p>
          <input
            type="checkbox"
            checked={showCash}
            onChange={(e) => setShowCash(e.target.checked)}
            className="w-6 h-6 "
          />
        </div>
      </div>

      {/* {----------Part of Receipt Card --------------} */}

      <div className="p-2 flex flex-wrap justify-center-safe space-y-4 space-x-2">
        {filteredReceipts.map((r) => (
          <ReceiptCard key={r.id} {...r} />
        ))}
      </div>
    </>
  );
}

export default ReceiptList;

this is parent:
import { useEffect, useState } from "react";
import ReceiptList from "./components/ReceiptList";
import CircleAnimation from "../../components/animation";

export default function Sales() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading (replace with your real data fetch if needed)
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return loading ? <CircleAnimation /> : <ReceiptList />;
}


and the endpoint is apiClient.get('/sales/sales)
now i want you to do connect it to the backend for me using react query. if you have any question ask me