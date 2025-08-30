import { useRef, useState } from "react";
import { Home, ShoppingCart, DollarSign, Settings, Wallet } from "lucide-react";
import { useParams } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import { useCurrencyStore, useVendorStore } from "../../../../stores";

import VendorOverview from "./vendorProfile/VendorOverview";
import UpdateContactPage from "./vendorForm/UpdateVendorForm";
import VendorPayment from "./vendorProfile/VendorPayment";
import VendorPurchaseList from "./vendorProfile/VendorPurchaseList";
import RouteBox from "../../../../components/RouteBox";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function VendorProfil() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(t("Overview")); // State to manage active tab
  const { id } = useParams();
  const { vendors } = useVendorStore();
  const vendor = vendors.find((item) => item.id === Number(id));

  const [image, setImage] = useState(vendor?.photo);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const BaseCurrencyId = useCurrencyStore((s) => s.getBaseCurrency)().id;
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  // Edit image handler
  const handleEditImage = () => {
    fileInputRef.current?.click();
  };

  const { updateVendorPhoto } = useVendorStore();

  // Handle file input change
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const oldImage = image;
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setImage(ev.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);

      // Upload To server
      const { error } = await updateVendorPhoto(Number(id), file);
      if (error) {
        toast.error(error);
        setImage(oldImage);
      } else {
        toast.success(t("vendor photo updated successfully!"));
      }
    }
  };
  const routebox = [
    { path: "/purchase", name: t("Purchase") },
    { path: "/purchase/vendors", name: t("Vendors") },
    { path: "", name: vendor?.name || t("Loading...") },
  ];

  return (
    <>
      <RouteBox items={routebox} routlength={routebox.length} />

      <div className="mt-[-15px] bg-gray-100 font-sans text-gray-800">
        {/* Navigation Tabs */}
        <div className="bg-white shadow-md mx-4 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 justify-between items-center">
          <nav className="flex space-x-6 ">
            {[
              { name: t("Overview"), icon: Home },
              { name: t("Purchase List"), icon: ShoppingCart },
              { name: t("Payments"), icon: DollarSign },
              { name: t("Edit Profiles"), icon: Settings },
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

          <div className="mt-4 md:mt-0 md:ml-auto bg-indigo-600 text-white p-3 rounded-xl shadow-lg flex items-center space-x-3 ">
            <div className="relative">
              <img
                src={image ?? undefined}
                className="w-15 h-15 object-cover rounded-full border-4 border-blue-400 shadow"
              />

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />

              <button
                className="absolute  top-12 left-13  text-white "
                title="Edit Image"
                onClick={handleEditImage}
              >
                <FaCamera className="h-4 w-4" />
              </button>
            </div>
            <span className="text-xl font-semibold">{vendor?.name}</span>

            <Wallet className="w-7 h-7" />
            <div>
              <p className="text-sm opacity-90">{t("Current Balance")}</p>
              <p className="text-xl font-bold">
                {formatPriceWithCurrency(
                  vendor ? parseFloat(vendor.balance.toString()) : 0,
                  BaseCurrencyId
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area based on active tab */}
        <div className="p-6 ">
          {activeTab === t("Overview") && (
            <VendorOverview vendorId={Number(id)} />
          )}

          {activeTab === t("Purchase List") && <VendorPurchaseList />}

          {activeTab === t("Payments") && <VendorPayment id={Number(id)} />}

          {activeTab === t("Edit Profiles") && (
            <UpdateContactPage id={Number(id)} />
          )}
        </div>
      </div>
    </>
  );
}
