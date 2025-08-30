import { useState } from "react";
import RouteBox from "../../../../components/RouteBox";
import { Activity } from "lucide-react";

import ExpenseAddList from "./ExpenseAddList";
import ExpensePayment from "./ExpensePayment";
import { FaPaypal } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function Expense() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(t("Add Expense")); // State to manage active tab

  const routebox = [{ path: "", name: t("Expense") }];

  return (
    <>
      <RouteBox items={routebox} routlength={routebox.length} />

      <div className="text-gray-800">
        {/* Navigation Tabs */}
        <div className=" shadow-md mx-4 rounded-xl p-4 grid grid-cols-1  justify-between items-center">
          <nav className="flex space-x-6 ">
            {[
              { name: t("Add Expense"), icon: Activity },
              { name: t("Pay Expence"), icon: FaPaypal },
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
          {activeTab === t("Add Expense") && <ExpenseAddList />}

          {activeTab === t("Pay Expence") && <ExpensePayment />}
        </div>
      </div>
    </>
  );
}

export default Expense;
