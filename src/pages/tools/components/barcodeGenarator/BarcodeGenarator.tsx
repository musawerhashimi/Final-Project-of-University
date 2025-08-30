import { useState } from "react";

import apiClient from "../../../../lib/api";
import { extractAxiosError } from "../../../../utils/extractError";
import LabelPreviewGrid from "./LabalPrievew";
import ControlPanel from "./ControlabelBox";
import RouteBox from "../../../../components/RouteBox";
import { useTranslation } from "react-i18next";

interface ProductInfo {
  name: string;
  price: number;
  currency_code: string;
}

export interface LabelData extends ProductInfo {
  id: number;
  batchNumber: number;
}

export default function BarcodeGenarator() {
  const [barcode, setBarcode] = useState<string>("");
  const [batchCount, setBatchCount] = useState<number>(5);
  const [labelsPerBatch, setLabelsPerBatch] = useState<number>(6);
  const [, setProductInfo] = useState<ProductInfo | null>(null);
  const [generatedLabels, setGeneratedLabels] = useState<LabelData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Core Logic
  const handleGenerate = async () => {
    if (!barcode) {
      setError(t("Please enter a barcode."));
      return;
    }
    setIsLoading(true);
    setError(null);
    setProductInfo(null);
    setGeneratedLabels([]);

    try {
      const response = await apiClient.post("/catalog/barcode-info", {
        barcode,
      });
      const info = response.data;
      setProductInfo(info);

      const totalLabels = batchCount * labelsPerBatch;
      const labels = Array.from({ length: totalLabels }, (_, i) => ({
        id: i + 1,
        batchNumber: Math.floor(i / labelsPerBatch) + 1,
        ...info,
      }));
      setGeneratedLabels(labels);
    } catch (err) {
      const errorMessage = extractAxiosError(
        err,
        t("An unexpected error occurred.")
      );
      setError(errorMessage);
      setProductInfo(null);
    } finally {
      setIsLoading(false);
    }
  };
  const { t } = useTranslation();
  const routename = [
    { path: "/tools", name: t("Tools") },
    { path: "", name: t("Barcode Genarator") },
  ];
  return (
    <>
      <RouteBox items={routename} routlength={routename.length} />
      <div className="mt-[-15px] bg-gradient-to-br from-blue-100 to-purple-100 p-4 dark:bg-gray-900  transition-colors duration-300">
        <div className="grid grid-cols-1  gap-4">
          <ControlPanel
            barcode={barcode}
            setBarcode={setBarcode}
            batchCount={batchCount}
            setBatchCount={setBatchCount}
            labelsPerBatch={labelsPerBatch}
            setLabelsPerBatch={setLabelsPerBatch}
            isLoading={isLoading}
            error={error}
            onGenerate={handleGenerate}
          />
          <LabelPreviewGrid
            labels={generatedLabels}
            barcodeValue={barcode}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </>
  );
}
