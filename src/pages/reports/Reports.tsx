import {
  FaBoxes,
  FaMoneyBill,
  FaCalendarAlt,
  FaHandshake,
  FaUserFriends,
} from "react-icons/fa";
import SelectBox from "../../components/SelectBox";
import { useTranslation } from "react-i18next";

export default function Reports() {
  const { t } = useTranslation();
  const selectbox = [
    {
      path: "/reports/quickReport",
      icon: <FaBoxes />,
      name: t("Quick Report"),
      color: "bg-orange-400",
      start: "0px",
      duration: "duration-700",
    },

    {
      path: "/reports/monthlyReport",
      icon: <FaMoneyBill />,
      name: t("Monthly Report"),
      color: "bg-pink-500",
      start: "40px",
      duration: "duration-700",
    },
    {
      path: "/reports/salesReport",
      icon: <FaCalendarAlt />,
      name: t("Sales Report"),
      color: "bg-cyan-500",
      start: "80px",
      duration: "duration-800",
    },
    {
      path: "/reports/customerReport",
      icon: <FaHandshake />,
      name: t("Customer Report"),
      color: "bg-green-500",
      start: "120px",
      duration: "duration-900",
    },
    {
      path: "/reports/transactionReport",
      icon: <FaUserFriends />,
      name: t("Transaction Report"),
      color: "bg-purple-600",
      start: "160px",
      duration: "duration-1000",
    },
    {
      path: "/reports/stockWarehouseReport",
      icon: <FaUserFriends />,
      name: t("Store & Warehouse Report"),
      color: "bg-sky-600",
      start: "200px",
      duration: "duration-1000",
    },
    // {
    //   path: "/reports/userCashFlow",
    //   icon: <FaUserFriends />,
    //   name: "User Cash-Flow",
    //   color: "bg-orange-600",
    //   start: "240px",
    //   duration: "duration-1000",
    // },
  ];
  return <SelectBox items={selectbox} />;
}
