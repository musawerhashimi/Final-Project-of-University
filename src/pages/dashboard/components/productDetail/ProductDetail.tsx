import { useState } from "react";
import { Home, ShoppingCart, DollarSign, Settings } from "lucide-react";

import RouteBox from "../../../../components/RouteBox";
import ProductDetailsPage from "./ProductProfile";
import StockOverview from "./StockOverview";
import WarechouseOverview from "./WarechouseOverview";
import ProductStats from "./ProductStats";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ProductDetails() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(t("Profile")); // State to manage active tab
  const { productId: pId } = useParams<{ productId: string }>();
  const productId = Number(pId);
  const routebox = [{ path: "", name: t("Product Details") }];

  return (
    <>
      <RouteBox items={routebox} routlength={routebox.length} />

      <div className="mt-[-15px] min-h-screen bg-white font-sans text-gray-800">
        {/* Navigation Tabs */}
        <div className="shadow-md mx-4 rounded-xl p-4 grid grid-cols-1 justify-between items-center">
          <nav className="flex space-x-6 ">
            {[
              { name: t("Profile"), icon: Home },
              { name: t("Stock Overview"), icon: ShoppingCart },
              { name: t("Warehouse Overview"), icon: DollarSign },
              { name: t("Stats"), icon: Settings },
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  activeTab === tab.name
                    ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                <span className="hidden md:block">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area based on active tab */}
        <div className="p-6 ">
          {activeTab === t("Profile") && (
            <ProductDetailsPage productId={productId} />
          )}

          {activeTab === t("Stock Overview") && (
            <StockOverview productId={productId} />
          )}

          {activeTab === t("Warehouse Overview") && (
            <WarechouseOverview productId={productId} />
          )}

          {activeTab === t("Stats") && <ProductStats productId={productId} />}
        </div>
      </div>
    </>
  );
}
