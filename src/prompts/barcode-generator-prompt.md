import { useState } from "react";
import { apiClient } from "../../../lib/api";
import { AxiosError } from "axios";
import RouteBox from "../../../components/RouteBox";

// --- Types ---
interface ProductInfo {
  name: string;
  price: number;
  currency_code: string;
}

interface Batch {
  batchNumber: number;
  labels: number;
}

// --- Helper Functions ---
const formatCurrency = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
};

// --- Main Component ---
function BarcodeGenerator() {
  const routename = [
    { path: "/tools", name: "Tools" },
    { path: "", name: "Barcode Genarator" },
  ];
  const [barcode, setBarcode] = useState("");
  const [itemCount, setItemCount] = useState(1);
  const [labelsPerBatch, setLabelsPerBatch] = useState(10);

  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!barcode) {
      setError("Please enter a barcode.");
      return;
    }
    setIsLoading(true);
    setError("");
    setProductInfo(null);
    setBatches([]);

    try {
      const response = await apiClient.post<ProductInfo>(
        "/catalog/barcode-info",
        {
          barcode,
        }
      );
      const { name, price, currency_code } = response.data;
      setProductInfo({ name, price, currency_code });

      const totalBatches = Math.ceil(itemCount / labelsPerBatch);
      const generatedBatches = Array.from({ length: totalBatches }, (_, i) => {
        const isLastBatch = i === totalBatches - 1;
        const labelsInThisBatch =
          isLastBatch && itemCount % labelsPerBatch !== 0
            ? itemCount % labelsPerBatch
            : labelsPerBatch;
        return {
          batchNumber: i + 1,
          labels: labelsInThisBatch,
        };
      });
      setBatches(generatedBatches);
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) {
        setError(err.response?.data.message || "An unexpected error occurred.");
      }
      setProductInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <RouteBox items={routename} routlength={routename.length} />

      <div
        style={{
          "--color-background-barcode": "#ffffff",
          "--color-text-primary-barcode": "#111827",
          "--color-text-secondary-barcode": "#6b7280",
          "--color-border-barcode": "#e5e7eb",
          "--color-primary-barcode": "#4f46e5",
          "--color-primary-hover-barcode": "#4338ca",
          "--color-card-bg-barcode": "#f9fafb",
          "--color-error-barcode": "#ef4444",
        }}
        className="dark:[--color-background-barcode:#111827] dark:[--color-text-primary-barcode:#ffffff] dark:[--color-text-secondary-barcode:#9ca3af] dark:[--color-border-barcode:#374151] dark:[--color-primary-barcode:#6366f1] dark:[--color-primary-hover-barcode:#4f46e5] dark:[--color-card-bg-barcode:#1f2937] bg-[var(--color-background-barcode)] text-[var(--color-text-primary-barcode)] min-h-screen p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-300"
      >
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Barcode Batch Generator
            </h1>
            <p className="mt-2 text-lg text-[var(--color-text-secondary-barcode)]">
              Enter a barcode and item details to generate print batches.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-[var(--color-card-bg-barcode)] rounded-2xl border border-[var(--color-border-barcode)] shadow-sm">
            {/* Input Section */}
            <div className="md:col-span-1 space-y-4">
              <div>
                <label
                  htmlFor="barcode"
                  className="block text-sm font-medium text-[var(--color-text-secondary-barcode)] mb-1"
                >
                  Barcode
                </label>
                <input
                  id="barcode"
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="e.g., 1234567890123"
                  className="w-full px-3 py-2 bg-[var(--color-background-barcode)] border border-[var(--color-border-barcode)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-barcode)] focus:border-[var(--color-primary-barcode)] outline-none transition"
                />
              </div>
              <div>
                <label
                  htmlFor="item-count"
                  className="block text-sm font-medium text-[var(--color-text-secondary-barcode)] mb-1"
                >
                  Total Items
                </label>
                <input
                  id="item-count"
                  type="number"
                  value={itemCount}
                  onChange={(e) =>
                    setItemCount(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  min="1"
                  className="w-full px-3 py-2 bg-[var(--color-background-barcode)] border border-[var(--color-border-barcode)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-barcode)] focus:border-[var(--color-primary-barcode)] outline-none transition"
                />
              </div>
              <div>
                <label
                  htmlFor="labels-per-batch"
                  className="block text-sm font-medium text-[var(--color-text-secondary-barcode)] mb-1"
                >
                  Labels per Batch
                </label>
                <input
                  id="labels-per-batch"
                  type="number"
                  value={labelsPerBatch}
                  onChange={(e) =>
                    setLabelsPerBatch(
                      Math.max(1, parseInt(e.target.value) || 1)
                    )
                  }
                  min="1"
                  className="w-full px-3 py-2 bg-[var(--color-background-barcode)] border border-[var(--color-border-barcode)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-barcode)] focus:border-[var(--color-primary-barcode)] outline-none transition"
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 font-semibold text-white bg-[var(--color-primary-barcode)] rounded-lg hover:bg-[var(--color-primary-hover-barcode)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background-barcode)] focus:ring-[var(--color-primary-barcode)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Generating...
                  </>
                ) : (
                  "Generate Batches"
                )}
              </button>
              {error && (
                <p className="text-sm text-[var(--color-error-barcode)] mt-2">
                  {error}
                </p>
              )}
            </div>

            {/* Output Section */}
            <div className="md:col-span-2">
              <div className="h-full p-6 bg-[var(--color-background-barcode)] rounded-xl border border-[var(--color-border-barcode)]">
                {!productInfo && !isLoading && !error && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-16 h-16 text-[var(--color-text-secondary-barcode)] opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium">
                      Batch details will appear here
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary-barcode)]">
                      Ready to generate.
                    </p>
                  </div>
                )}
                {isLoading && (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-[var(--color-text-secondary-barcode)]">
                      Fetching product info...
                    </p>
                  </div>
                )}
                {productInfo && !isLoading && (
                  <div>
                    <div className="pb-4 mb-4 border-b border-[var(--color-border-barcode)]">
                      <h2 className="text-xl font-bold">{productInfo.name}</h2>
                      <p className="text-lg font-semibold text-[var(--color-primary-barcode)]">
                        {formatCurrency(
                          productInfo.price,
                          productInfo.currency_code
                        )}
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary-barcode)]">
                        Barcode: {barcode}
                      </p>
                    </div>
                    <h3 className="font-semibold mb-3">
                      Generated Batches ({batches.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-2">
                      {batches.map((batch) => (
                        <div
                          key={batch.batchNumber}
                          className="p-3 bg-[var(--color-card-bg-barcode)] rounded-lg border border-[var(--color-border-barcode)] text-center"
                        >
                          <p className="font-bold text-lg">
                            {batch.batchNumber}
                          </p>
                          <p className="text-sm text-[var(--color-text-secondary-barcode)]">
                            {batch.labels} labels
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BarcodeGenerator;



Hey bro this has some issues:

first i need you to generate barcode for the given barcode using react-barcode

and each label has product_name with price with currency, logo and the barcode from react-barcode.

second: i told you to define a color and give it to values for light and dark

like

:root {

  --color-dfgfrtgf: #ddd;

}

[data-theme='dark'] {

--color-dfgfrtgf: #333;

}


and user may want 10 batch with 3 labels per batch so that means you make ten batches with labels described like that

and a button to print the batches so we can print and stick in items bro
if you have any question, ask before you proceed.