import type { IconType } from "react-icons";
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaShoppingBasket,
  FaChartLine,
  FaUsers,
  FaWarehouse,
  FaTools,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import type { Permission } from "./permissions";

// components/sidebar/sidebarItems.ts
export interface SidebarItemData {
  label: string;
  link: string;
  Icon: IconType;
  permission?: Permission | Permission[];
}

// Centralized items data
const sidebarItems: SidebarItemData[] = [
  {
    label: "dashboard",
    link: "/",
    Icon: FaTachometerAlt,
    permission: ["sales", "inventory"],
  },
  { label: "sales", link: "/sales", Icon: FaShoppingCart },
  {
    label: "purchase",
    link: "/purchase",
    Icon: FaShoppingBasket,
  },
  {
    label: "finance",
    link: "/finance",
    Icon: FaChartLine,
  },
  { label: "customers", link: "/customers", Icon: FaUsers },
  {
    label: "stockAndWarehouses",
    link: "/stockAndWarehouse",
    Icon: FaWarehouse,
  },
  { label: "tools", link: "/tools", Icon: FaTools },
  { label: "reports", link: "/reports", Icon: FaChartBar },
  { label: "settings", link: "/settings", Icon: FaCog },
];

export default sidebarItems;
