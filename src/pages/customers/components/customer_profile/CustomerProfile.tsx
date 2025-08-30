// CustomerProfile.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LeftsideProfile from "./LeftsideProfile";
import RightsideProfile from "./RightsideProfile";
import { useParams } from "react-router-dom";
import RouteBox from "../../../../components/RouteBox";
import { FaBars, FaTimes } from "react-icons/fa";
import { apiClient } from "../../../../lib/api";
import { type Customer } from "../../../../entities/Customer";
import { useTranslation } from "react-i18next";

export default function CustomerProfile() {
  const { id } = useParams<{ id: string }>();
  const [showSidebar, setShowSidebar] = useState(false);
  const { t } = useTranslation();
  const {
    data: customer,
    isLoading,
    error,
    refetch,
  } = useQuery<Customer>({
    queryKey: ["customer", id],
    queryFn: async () => {
      const response = await apiClient.get(`/customers/customers/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">{t("Loading customer data...")}</div>
      </div>
    );
  }

  if (error || !customer) {
    return <p className="text-red-500">{t("Customer not found")}</p>;
  }

  const routename = [
    { path: "/customers", name: t("Customers") },
    { path: "", name: customer.name },
  ];

  return (
    <>
      <RouteBox items={routename} routlength={routename.length} />

      {/* Mobile: Open Sidebar Button */}
      <button
        className="md:hidden relative top-17 left-5 z-50 bg-blue-600 text-white p-2 rounded-full shadow"
        onClick={() => setShowSidebar(true)}
        aria-label="Open customer info"
      >
        <FaBars size={20} />
      </button>

      <div className="mt-[-15px] bg-gray-100 flex font-inter">
        {/* Sidebar Navigation (Desktop) */}
        <aside className="w-70 bg-white p-6 shadow-md flex-col hidden md:block">
          <LeftsideProfile items={customer} onRefetch={refetch} />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full p-8">
          <RightsideProfile items={customer} onRefetch={refetch} />
        </main>
      </div>

      {/* Mobile Sidebar Modal */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-white/60 backdrop:blur-3xl bg-opacity-40"
            onClick={() => setShowSidebar(false)}
          ></div>
          {/* Sidebar */}
          <aside className="relative w-70 max-w-xs bg-white p-6 shadow-lg h-full z-50 animate-slide-in-left overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setShowSidebar(false)}
              aria-label="Close customer info"
            >
              <FaTimes size={24} />
            </button>
            <LeftsideProfile items={customer} onRefetch={refetch} />
          </aside>
        </div>
      )}
    </>
  );
}
