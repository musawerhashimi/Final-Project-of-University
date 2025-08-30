import { useTranslation } from "react-i18next";

import { useLocationStore } from "../../../../stores";

import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Package,
  Warehouse,
} from "lucide-react";
import { useDirection } from "../../../../hooks/useDirection";

interface Props {
  onBrowse: (id: number) => void;
}

function WarehouseCard({ onBrowse }: Props) {
  const getStores = useLocationStore((s) => s.getStores);
  const getWarehouses = useLocationStore((s) => s.getWarehouses);

  const stores = getStores();
  const warehouses = getWarehouses();
  const { t } = useTranslation();
  const direction = useDirection();
  return (
    <div className="m-4 p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:mt-0">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-8 flex items-center gap-3">
          <Package className="w-8 h-8" /> {t("Stores")}
          <span className="ml-2 bg-blue-100 text-blue-700 rounded-full px-4 py-1  font-bold">
            {stores.length}
          </span>
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {stores.length === 0 ? (
            <div className="text-gray-400 text-center py-16 bg-white rounded-2xl shadow-lg">
              {t("No stocks added yet.")}
            </div>
          ) : (
            stores.map((item, idx) => (
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
                    <span className="text-sm ">{item.address}</span>
                  </div>
                  <table className="w-full bg-blue-100 mt-2  rounded-md ">
                    <thead className="border-b border-gray-300">
                      <th className="text-sm">{t("Total Products")}</th>
                      <th className="text-sm">{t("Total Quantity")}</th>
                    </thead>
                    <tbody className="text-center">
                      <td>{item.total_products}</td>
                      <td>{item.total_quantity}</td>
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={() => onBrowse(item.id)}
                  className="py-6 px-1 bg-blue-500 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 text-sm"
                >
                  {direction == "ltr" ? <ArrowRight /> : <ArrowLeft />}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-extrabold text-green-700 mb-8 flex items-center gap-3">
          <Warehouse className="w-8 h-8" /> {t("Warehouses")}
          <span className="ml-2 bg-green-100 text-green-700 rounded-full px-4 py-1 font-bold">
            {warehouses.length}
          </span>
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {warehouses.length === 0 ? (
            <div className="text-gray-400 text-center py-16 bg-white rounded-2xl shadow-lg">
              {t("No warehouses added yet.")}
            </div>
          ) : (
            warehouses.map((warehous, idx) => (
              // ---------------------------------
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col sm:flex-row items-center gap-6 border-l-8 border-green-400 hover:scale-[1.02] transition-transform duration-200"
              >
                <div className="flex-shrink-0 bg-green-100 rounded-full p-5">
                  <Warehouse className="w-10 h-10 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-green-800 mb-2">
                    {warehous.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 text-green-400" />
                    <span className="text-sm">{warehous.address}</span>
                  </div>

                  <table className="w-full bg-green-100 mt-2 rounded-md ">
                    <thead className="border-b border-gray-300">
                      <th className="text-sm">{t("Total Products")}</th>
                      <th className="text-sm">{t("Total Quantity")}</th>
                    </thead>
                    <tbody className="text-center">
                      <td>{warehous.total_products}</td>
                      <td>{warehous.total_quantity}</td>
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={() => onBrowse(warehous.id)}
                  className="py-6 px-1 bg-success hover:bg-success-hover text-white rounded-lg transition-colors duration-300 text-sm"
                >
                  {direction == "ltr" ? <ArrowRight /> : <ArrowLeft />}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default WarehouseCard;
