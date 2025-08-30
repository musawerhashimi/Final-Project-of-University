import { FaListAlt, FaUserTie } from "react-icons/fa";
import SelectBox from "../../components/SelectBox";
import { useTranslation } from "react-i18next";

function Purchase() {
  const { t } = useTranslation();
  const selectbox = [
    {
      path: "/purchase/vendors",
      icon: <FaUserTie />,
      name: t("Vendors"),
      color: "bg-red-500",
      start: "0px",
      duration: "duration-900",
    },
    {
      path: "/purchase/purchaseList",
      icon: <FaListAlt />,
      name: t("Purchase List"),
      color: "bg-sky-500",
      start: "80px",
      duration: "duration-1000",
    },
  ];
  return (
    <>
      <SelectBox items={selectbox} />
    </>
  );
}

export default Purchase;
