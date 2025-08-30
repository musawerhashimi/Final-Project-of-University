import { MapPin, Package, PlusCircle, Warehouse } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  stockWarehouseSchema,
  type StockWarehouseData,
} from "../../schemas/stock_warehouse_vali";
import { useLocationStore } from "../../stores";
import type { Location } from "../../entities/Location";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";

export default function StockAndWarehouse() {
  const { t } = useTranslation();
  const { getStores, getWarehouses, createLocation, error, loading } =
    useLocationStore();
  const stocks = getStores();
  const warehouses = getWarehouses();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<Omit<Location, "id" | "total_products" | "total_quantity">>({
    resolver: zodResolver(stockWarehouseSchema),
    defaultValues: {
      name: "",
      location_type: "store",
      address: "",
    },
  });

  const handleSubmitData = (data: StockWarehouseData) => {
    createLocation(data)
      .then(() => {
        toast.success(t("Location added successfully!"));
      })
      .catch(() => {
        toast.error(error || t("Failed to add location"));
      });

    reset();
  };

  return (
    <>
      {/* Form section */}
      <div className="bg-gradient-to-br from-blue-50 to-green-50">
        <form
          className="p-8 flex flex-col"
          onSubmit={handleSubmit(handleSubmitData)}
        >
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2 mb-2">
            <PlusCircle className="w-7 h-7" /> {t("Add Store or Warehouse")}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Name")}
              </label>
              <input
                type="text"
                {...register("name")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
                placeholder="e.g., Main Store, Central Warehouse"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Type")}
              </label>
              <select
                {...register("location_type")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                  errors.location_type
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              >
                <option value="store">{t("Store")}</option>
                <option value="warehouse">{t("Warehouse")}</option>
              </select>
              {errors.location_type && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.location_type.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Address")}
              </label>
              <input
                type="text"
                {...register("address")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                  errors.address
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
                placeholder="e.g., 123 Main St, City, Country"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <Button
              type="submit"
              loading={loading}
              label={t("Add Location")}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow transition"
            />
          </div>
        </form>
      </div>
      {/* End Form section */}

      <div className=" bg-gradient-to-br from-blue-50 to-green-50 p-8 font-inter flex flex-col md:flex-row gap-8">
        {/* Stock Side */}
        <div className="flex-1  md:mt-0">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-8 flex items-center gap-3">
            <Package className="w-8 h-8" /> {t("Stores")}
            <span className="ml-2 bg-blue-100 text-blue-700 rounded-full px-4 py-1  font-bold">
              {stocks.length}
            </span>
          </h2>
          <div className="space-y-8">
            {stocks.length === 0 ? (
              <div className="text-gray-400 text-center py-16 bg-white rounded-2xl shadow-lg">
                {t("No Store added yet.")}
              </div>
            ) : (
              stocks.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-xl p-8 flex flex-col sm:flex-row items-center gap-6 border-l-8 border-blue-400 hover:scale-[1.02] transition-transform duration-200"
                >
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-5">
                    <Package className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-blue-800 mb-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <span className="text-lg">{item.address}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* End Stock Side */}

        {/* Vertical Divider */}
        <div className="hidden md:block w-px bg-gray-300 mx-4" />

        {/* Warehouse Side */}
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold text-green-700 mb-8 flex items-center gap-3">
            <Warehouse className="w-8 h-8" /> {t("Warehouses")}
            <span className="ml-2 bg-green-100 text-green-700 rounded-full px-4 py-1 font-bold">
              {warehouses.length}
            </span>
          </h2>
          <div className="space-y-8">
            {warehouses.length === 0 ? (
              <div className="text-gray-400 text-center py-16 bg-white rounded-2xl shadow-lg">
                {t("No warehouses added yet.")}
              </div>
            ) : (
              warehouses.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-xl p-8 flex flex-col sm:flex-row items-center gap-6 border-l-8 border-green-400 hover:scale-[1.02] transition-transform duration-200"
                >
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-5">
                    <Warehouse className="w-10 h-10 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-green-800 mb-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5 text-green-400" />
                      <span className="text-lg">{item.address}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/*  End Warehouse Side */}
      </div>
    </>
  );
}
