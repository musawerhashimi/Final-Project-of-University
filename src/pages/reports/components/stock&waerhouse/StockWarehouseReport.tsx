import { useState, useEffect } from "react";
import { useLocationStore } from "../../../../stores"; // Reverted to original import
import RouteBox from "../../../../components/RouteBox";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function StockWarehouseReport() {
  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const { t } = useTranslation();
  const { getStores, getWarehouses, error, loading } = useLocationStore();
  // Ensure stocks and warehouses are always arrays to prevent errors
  const stocks = Array.isArray(getStores()) ? getStores() : [];
  const warehouses = Array.isArray(getWarehouses()) ? getWarehouses() : [];

  // Reset selected location when type changes
  useEffect(() => {
    setSelectedLocation("");
  }, [selectedType]);

  // Determine which location options to display based on selected type
  const getLocationOptions = () => {
    if (selectedType === "Stock") {
      return stocks;
    } else if (selectedType === "Warehouse") {
      return warehouses;
    }
    return [];
  };

  // Handle change for the type dropdown
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  // Handle change for the location dropdown
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value);
  };
  const route = [
    { name: t("Reports"), path: "/reports" },
    { name: t("Store & Warehouse Report"), path: "" },
  ];

  return (
    <>
      <RouteBox items={route} routlength={route.length} />
      <div className=" mt-[-15px] h-[91%] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-inter">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-3xl">
          <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700 mb-8">
            {t("Store & Warehouse Report")}
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-sm flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-3 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {t("Error")}: {error}
              </span>
            </div>
          )}

          <div className="space-y-6">
            {/* Type Selection Field */}
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {t("Select Location Type")}
              </label>

              <div className="relative">
                <select
                  id="type"
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="block w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-200 ease-in-out appearance-none bg-white text-gray-800 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <option value="">{t("Choose a Location Type")}</option>
                  <option value="Stock">{t("Store")}</option>
                  <option value="Warehouse">{t("Warehouse")}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Location Selection Field */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {selectedType
                  ? ` ${
                      selectedType === "Stock"
                        ? t("Select Store Location")
                        : t("Select Warehouse Location")
                    }`
                  : t("Select Location")}
              </label>
              <div className="relative">
                <select
                  id="location"
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  className="block w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition duration-200 ease-in-out appearance-none bg-white text-gray-800 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled={!selectedType || loading}
                >
                  <option value="">
                    {!selectedType
                      ? t("Please choose a location type first")
                      : t("Choose a Location")}
                  </option>
                  {getLocationOptions().map((location: any, index: number) => (
                    <option
                      key={location.id || location.name || index} // Use a robust key
                      value={location.id || location.name || location}
                    >
                      {location.name || location}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mx-auto ">
              <Link
                className="block text-center mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-md disabled:transform-none disabled:cursor-not-allowed"
                to={`/reports/StockWarehouseReport/${selectedLocation}`}
              >
                {loading ? t("Loading...") : t("Generate Report")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StockWarehouseReport;
