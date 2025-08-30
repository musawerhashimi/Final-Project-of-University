import { FaCog, FaUser } from "react-icons/fa";
import SelectBox, { type Box } from "../../components/SelectBox";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const { t } = useTranslation();
  const selectbox: Box[] = [
    {
      path: "/settings/general-settings",
      icon: <FaCog />,
      name: t("General Settings"),
      color: "bg-sky-500",
      start: "0px",
      duration: "duration-700",
    },

    {
      path: "/settings/profile",
      icon: <FaUser />,
      name: t("User Profile"),
      color: "bg-red-400",
      start: "40px",
      duration: "duration-800",
    },
    {
      path: "/settings/users",
      icon: <FaUser />,
      name: t("Users"),
      color: "bg-purple-400",
      start: "80px",
      duration: "duration-900",
      permission: "users",
    },
  ];
  return <SelectBox items={selectbox} />;
}
