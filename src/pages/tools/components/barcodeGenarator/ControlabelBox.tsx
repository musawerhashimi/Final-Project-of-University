import { useTranslation } from "react-i18next";

interface ControlPanelProps {
  barcode: string;
  setBarcode: (value: string) => void;
  batchCount: number;
  setBatchCount: (value: number) => void;
  labelsPerBatch: number;
  setLabelsPerBatch: (value: number) => void;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
}

export default function ControlPanel({
  barcode,
  setBarcode,
  batchCount,
  setBatchCount,
  labelsPerBatch,
  setLabelsPerBatch,
  isLoading,

  error,
  onGenerate,
}: ControlPanelProps) {
  const totalLabels = batchCount * labelsPerBatch;
  const { t } = useTranslation();
  return (
    <div className=" p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md h-fit">
      <h1 className="text-xl mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
        {t("Barcode Generator")}
      </h1>
      <div className="space-y-5">
        <div>
          <label
            htmlFor="barcode"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t("Barcode")}
          </label>
          <input
            id="barcode"
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="e.g., 123456789012"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="batch-count"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t("Number of Batches")}
          </label>
          <input
            id="batch-count"
            type="number"
            value={batchCount}
            onChange={(e) =>
              setBatchCount(Math.max(1, parseInt(e.target.value) || 1))
            }
            min="1"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="labels-per-batch"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t("Labels per Batch")}
          </label>
          <input
            id="labels-per-batch"
            type="number"
            value={labelsPerBatch}
            onChange={(e) =>
              setLabelsPerBatch(Math.max(1, parseInt(e.target.value) || 1))
            }
            min="1"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-gray-900 dark:text-white"
          />
        </div>
        <div className="pt-2">
          <button
            onClick={onGenerate}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {t("Generating...")}
              </>
            ) : (
              `${t("Generate")} ${totalLabels} ${t("Labels")}`
            )}
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
        )}
      </div>
    </div>
  );
}
