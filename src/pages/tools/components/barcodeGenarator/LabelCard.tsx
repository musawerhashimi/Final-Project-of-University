import Barcode from "react-barcode";
import type { LabelData } from "./BarcodeGenarator";
import { formatCurrency } from "./FormatCurrency";
interface LabelCardProps {
  label: LabelData;
  barcodeValue: string;
}

export default function LabelCard({ label, barcodeValue }: LabelCardProps) {
  return (
    <div className="grid grid-cols-1 p-4 mx-auto bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 w-full">
        <div>
          <svg
            className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="text-start">
          <p className="font-bold text-[14px] leading-tight text-gray-800 dark:text-gray-100">
            {label.name}
          </p>
          <p className="text-[14px] text-indigo-600 dark:text-indigo-400 font-semibold">
            {formatCurrency(label.price, label.currency_code)}
          </p>
        </div>
      </div>
      <div className="bg-gray-200  dark:bg-white rounded p-1">
        <Barcode
          value={barcodeValue}
          width={2}
          height={40}
          format="CODE128"
          displayValue={true}
          fontOptions="bold"
          fontSize={12}
          background="transparent"
          lineColor="#000000"
        />
      </div>
    </div>
  );
}
