import {
  FaBoxes,
  FaCalendarAlt,
  // FaHandshake,
  FaMoneyBill,
  FaUserFriends,
} from "react-icons/fa";
import SelectBox from "../../components/SelectBox";
import { useTranslation } from "react-i18next";

function Finance() {
  const { t } = useTranslation();
  const selectbox = [
    {
      path: "/finance/resources",
      icon: <FaBoxes />,
      name: t("Resources"),
      color: "bg-orange-400",
      start: "0px",
      duration: "duration-600",
    },

    {
      path: "/finance/paymentsReceive",
      icon: <FaMoneyBill />,
      name: t("Payments/Receive"),
      color: "bg-pink-500",
      start: "40px",
      duration: "duration-700",
    },
    {
      path: "/finance/monthlyPayments",
      icon: <FaCalendarAlt />,
      name: t("Monthly Payments"),
      color: "bg-cyan-500",
      start: "80px",
      duration: "duration-800",
    },
    // {
    //   path: "/finance/members",
    //   icon: <FaHandshake />,
    //   name: t("Members"),
    //   color: "bg-green-500",
    //   start: "120px",
    //   duration: "duration-900",
    // },
    {
      path: "/finance/employees",
      icon: <FaUserFriends />,
      name: t("Employees"),
      color: "bg-purple-600",
      start: "120px",
      duration: "duration-900",
    },
  ];
  return (
    <>
      <SelectBox items={selectbox} />
    </>
  );
}

export default Finance;
