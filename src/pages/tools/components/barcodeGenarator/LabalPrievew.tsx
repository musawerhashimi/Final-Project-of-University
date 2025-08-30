import { Printer } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import { useDirection } from "../../../../hooks/useDirection";
import type { LabelData } from "./BarcodeGenarator";
import LabelCard from "./LabelCard";

interface LabelPreviewGridProps {
  labels: LabelData[];
  barcodeValue: string;
  isLoading: boolean;
  error: string | null;
}

export default function LabelPreviewGrid({
  labels,
  barcodeValue,
  isLoading,
  error,
}: LabelPreviewGridProps) {
  const hasLabels = labels.length > 0;
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .bg-blue-50 { background-color: #ebf8ff !important; }
        .bg-green-50 { background-color: #f0fff4 !important; }
      }
    `,
  });
  const direction = useDirection();
  return (
    <div className="relative p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        {t("Label Preview")}
      </h2>
      {/* PDF Button */}
      <button
        className="absolute top-5 end-8 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow print:hidden"
        title="Download PDF"
        onClick={reactToPrintFn}
      >
        <Printer className="inline" /> {t("Print")}
      </button>
      <div className=" pr-2">
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 dark:text-gray-400">
              {t("Fetching product info and generating labels...")}
            </p>
          </div>
        )}
        {!isLoading && error && !hasLabels && (
          <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <p className="text-red-500 dark:text-red-400">
              {t("Generation failed. Please check the barcode and try again.")}
            </p>
          </div>
        )}
        {!isLoading && !error && !hasLabels && (
          <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
              {t("Your labels will appear here")}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("Enter details and click Generate to start.")}
            </p>
          </div>
        )}
        {hasLabels && (
          <div
            className="grid grid-cols-2 md:grid-cols-5  gap-4 print:gap-1 print:p-7 print:md:grid-cols-4 print:grid-cols-3 "
            dir={direction}
            ref={contentRef}
          >
            {labels.map((label) => (
              <LabelCard
                key={label.id}
                label={label}
                barcodeValue={barcodeValue}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
