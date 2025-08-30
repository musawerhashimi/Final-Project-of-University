import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import { FaDollarSign, FaGlobe, FaPlus } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import type { Permission } from "../../../data/permissions";
import { Can } from "../../../providers/Can";
import CurrencyPopup from "./CurrencyPopup";
import Shortcut from "./shortcut/Shortcut";
import { useSettingsStore } from "../../../stores/useSettingsStore";

interface LinkData {
  type: "link";
  to: string;
}

interface ButtonData {
  type: "button";
  onClick: () => void;
  popup?: ReactNode;
}
interface ItemData {
  name: string;
  icon: IconType;
  content: LinkData | ButtonData;
  permission?: Permission;
}

function DashboardNavBar() {
  const shopSettings = useSettingsStore((s) => s.shopSettings);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isCurrencyOpen, setCurrencyOpen] = useState(false);
  const navbarItems: ItemData[] = [
    {
      name: t("add_product"),
      icon: FaPlus,
      permission: "purchases",
      content: {
        type: "link",
        to: "/dashboard/add-purchase",
      },
    },
    {
      name: t("currency"),
      icon: FaDollarSign,
      content: {
        type: "button",

        onClick() {
          setCurrencyOpen((prev) => !prev);
        },
        popup: (
          <CurrencyPopup isOpen={isCurrencyOpen} setOpen={setCurrencyOpen} />
        ),
      },
    },

    // {
    //   name: t("Ads-block"),
    //   icon: ShieldOff,
    //   content: {
    //     type: "button",
    //     onClick() {
    //       console.log("Button Clicked!");
    //     },
    //   },
    // },
    // {
    //   name: t("Notifications +0"),
    //   icon: Bell,
    //   content: {
    //     type: "button",
    //     onClick() {
    //       console.log("Button Clicked!");
    //     },
    //   },
    // },

    {
      name: t("language"),
      icon: FaGlobe,
      content: {
        type: "button",
        onClick() {},
      },
    },
  ];

  return (
    <nav className="px-4 py-2 sticky top-0 z-30 w-full shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="text-xl font-bold lg:hidden">
          <Link to="/"> {shopSettings?.shop_name}</Link>
        </div>

        {/* Hamburger button (mobile) */}
        <button
          className="lg:hidden p-2 focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>

        {/* Menu */}
        <div
          className={`
            absolute top-full left-0 right-0 bg-base overflow-hidden lg:overflow-visible shadow-md
            lg:static lg:shadow-none
            transition-max-height duration-300
            ${open ? "max-h-screen" : "max-h-0 lg:max-h-full"}
          `}
        >
          <ul className="flex flex-col lg:flex-row items-start lg:items-center space-y-2 lg:space-y-0 lg:space-x-6 p-4 lg:p-0">
            {navbarItems.map((item, idx) => (
              <Can key={idx} permission={item.permission}>
                <li className="w-full lg:w-auto">
                  {item.content.type === "link" ? (
                    <Link
                      to={item.content.to}
                      className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  focus:outline-none focus:ring-2 focus:ring-sky-600 hover:bg-sky-600 hover:text-white transition-all duration-400 hover:-translate-y-0.5"
                    >
                      <item.icon className="inline mx-1" />
                      {item.name}
                    </Link>
                  ) : (
                    <div>
                      <button
                        className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  focus:outline-none focus:ring-2 focus:ring-sky-600 hover:bg-sky-600 hover:text-white transition-all duration-400 hover:-translate-y-0.5"
                        onClick={item.content.onClick}
                      >
                        <item.icon className="inline mx-1" />
                        {item.name}
                      </button>
                      {item.content.popup}
                    </div>
                  )}
                </li>
              </Can>
            ))}
            <li className="w-full lg:w-auto hidden md:block">
              <Shortcut />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNavBar;
