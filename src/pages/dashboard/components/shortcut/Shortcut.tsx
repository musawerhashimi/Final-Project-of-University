import React, { useState, useRef, useEffect } from "react";
import {
  ArrowDownUp,
  Activity,
  Wallet,
  Building,
  Repeat2,
  Users,
} from "lucide-react";
import { FaShare } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link, type To } from "react-router-dom";
import type { Permission } from "../../../../data/permissions";
import { Can } from "../../../../providers/Can";

// Define the type for a shortcut item
interface ShortcutItem {
  icon: React.ElementType; // This allows us to pass Lucide React components directly
  label: string;
  permission?: Permission;
  path: To;
}

// Data for the shortcut items (static text, will translate later in rendering)
const shortcuts: ShortcutItem[] = [
  {
    icon: Activity,
    label: "Expense",
    permission: "expense",
    path: "/dashboard/expense",
  },
  {
    icon: Wallet,
    permission: "finance",
    label: "Pay For Employees",
    path: "/finance/paymentsReceive",
  },
  {
    icon: Building,
    label: "Pay For Asset",
    permission: "finance",
    path: "/finance/paymentsReceive",
  },
  {
    icon: Users,
    label: "Customer Profile",
    permission: "customers",
    path: "/dashboard/customer",
  },
  { icon: ArrowDownUp, label: "Resource Transfer", path: "" },
  { icon: Repeat2, label: "Warehouse Transfer", path: "" },
];

// Helper function to get dynamic background colors for shortcut icons
const getBackgroundColor = (index: number) => {
  const colors = [
    "#EF4444", // Tailwind red-500 equivalent
    "#EC4899", // Tailwind pink-500 equivalent
    "#8B5CF6", // Tailwind violet-500 equivalent
    "#4F46E5", // Tailwind indigo-600 equivalent
    "#3B82F6", // Tailwind blue-500 equivalent
    "#10B981", // Tailwind emerald-500 equivalent
  ];
  return colors[index % colors.length];
};

function Shortcut() {
  const { t } = useTranslation();
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Effect to close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsShortcutsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to toggle the dropdown's visibility
  const toggleShortcuts = () => {
    setIsShortcutsOpen((prev) => !prev);
  };

  return (
    <div className="w-full max-w-4xl gap-4 ">
      {/* Shortcuts Button and Dropdown Container */}
      <div className="relative inline-block text-left z-20">
        <button
          ref={buttonRef}
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  focus:outline-none focus:ring-2 focus:ring-sky-600 hover:bg-sky-600 group hover:text-white transition-all duration-400 hover:-translate-y-0.5"
          id="shortcuts-menu-button"
          aria-expanded={isShortcutsOpen}
          aria-haspopup="true"
          onClick={toggleShortcuts}
          aria-label="Shortcuts Menu"
        >
          <FaShare
            className="-ml-0.5 h-5 w-5 text-gray-600 group-hover:text-white transition-all duration-400 hover:-translate-y-0.5"
            aria-hidden="true"
          />
          {t("Shortcuts")}
          <svg
            className="-mr-1 h-5 w-5 text-gray-400 group-hover:text-white transition-all duration-400 hover:-translate-y-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Dropdown panel */}
        {isShortcutsOpen && (
          <div
            ref={dropdownRef}
            className="absolute start-0 mt-2 w-72 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none p-4
                         transform opacity-100 scale-100 transition-all duration-200 ease-out"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="shortcuts-menu-button"
          >
            <h3 className="text-xl font-extrabold text-gray-900 mb-4 px-2">
              {t("Shortcuts")}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {shortcuts.map((item, index) => (
                <Can key={index} permission={item.permission}>
                  <div
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition duration-150 ease-in-out group"
                    role="menuitem"
                    tabIndex={0}
                    aria-label={t(item.label)}
                  >
                    <Link to={item.path}>
                      <div
                        className="flex items-center justify-center w-14 h-14 rounded-xl mb-2 shadow-md group-hover:shadow-lg transition-shadow duration-150"
                        style={{ backgroundColor: getBackgroundColor(index) }}
                      >
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 text-center leading-tight group-hover:text-indigo-600">
                        {t(item.label)}
                      </span>
                    </Link>
                  </div>
                </Can>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Shortcut;
