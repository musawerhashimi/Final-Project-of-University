import { useState } from "react";
import { FaTimes, FaWarehouse, FaStore } from "react-icons/fa";
import { useLocationStore } from "../../../../stores/useLocationStore";
import { useTranslation } from "react-i18next";

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (locationId: number) => void;
  isLoading: boolean;
  purchaseNumber: string;
}

export default function ReceiveModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  purchaseNumber,
}: ReceiveModalProps) {
  const [locationType, setLocationType] = useState<"store" | "warehouse">(
    "store"
  );
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const { t } = useTranslation();
  const { getStores, getWarehouses } = useLocationStore();
  const stores = getStores();
  const warehouses = getWarehouses();

  const handleLocationTypeChange = (type: "store" | "warehouse") => {
    setLocationType(type);
    setSelectedLocationId(null);
  };

  const handleSubmit = () => {
    if (selectedLocationId) {
      onSubmit(selectedLocationId);
    }
  };

  const handleClose = () => {
    setSelectedLocationId(null);
    setLocationType("store");
    onClose();
  };

  const currentLocations = locationType === "store" ? stores : warehouses;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("Receive Purchase")}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Purchase Number */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">{t("Purchase Number")}</p>
            <p className="font-semibold text-gray-900">{purchaseNumber}</p>
          </div>

          {/* Location Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t("Select Location Type")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleLocationTypeChange("store")}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  locationType === "store"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                <FaStore className="text-lg" />
                <span className="font-medium">{t("Store")}</span>
              </button>
              <button
                onClick={() => handleLocationTypeChange("warehouse")}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  locationType === "warehouse"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                <FaWarehouse className="text-lg" />
                <span className="font-medium">{t("Warehouse")}</span>
              </button>
            </div>
          </div>

          {/* Location Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t("Select")}{" "}
              {locationType === "store" ? t("Store") : t("Warehouse")}
            </label>

            <select
              value={selectedLocationId || ""}
              onChange={(e) => setSelectedLocationId(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">
                {t("Choose a")}{" "}
                {locationType === "store" ? t("Store") : t("Warehouse")}
              </option>
              {currentLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            {t("Cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedLocationId || isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {t("Processing...")}
              </>
            ) : (
              t("Receive Purchase")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
