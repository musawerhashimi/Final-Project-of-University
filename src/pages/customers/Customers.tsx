// Main Customers Component
import { Button } from "primereact/button";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import CustomDialog from "../../components/CustomDialog";
import CustomerForm from "./components/CustomerForm";
import CustomerList from "./components/CustomerList";
import { useTranslation } from "react-i18next";

export default function Customers() {
  const [visible, setVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
  >("center");

  const handleAddCustomer = () => {
    setPosition("center");
    setVisible(true);
  };

  const handleCustomerCreated = () => {
    setVisible(false);
    // Show success message or perform any other action
  };
  const { t } = useTranslation();
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile Add Button */}
      <div className="block md:hidden w-full p-4 bg-white border-b border-slate-200">
        <Button
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          label={t("Add New Customer")}
          icon={<FaPlus className="mr-2" />}
          onClick={handleAddCustomer}
        />
      </div>

      {/* Dialog for Mobile */}
      <CustomDialog
        visible={visible}
        headerchildren={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaPlus className="text-blue-600" />
            </div>
            <span className="font-bold text-slate-800">
              {" "}
              {t("Add New Customer")}
            </span>
          </div>
        }
        bodychildren={
          <div className="w-full bg-white rounded-xl">
            <CustomerForm onSuccess={handleCustomerCreated} />
          </div>
        }
        footerchildren={
          <div className="flex gap-2">
            <Button
              className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
              label="Close"
              onClick={() => setVisible(false)}
            />
          </div>
        }
        position={position}
        onHide={() => setVisible(false)}
      />

      {/* Sidebar */}
      <aside className="w-full md:w-1/3 lg:w-1/4 p-3">
        <CustomerList />
      </aside>

      {/* Main content for desktop */}
      <main className="flex-1 p-6 hidden md:block">
        <CustomerForm />
      </main>
    </div>
  );
}
