import { FaBarcode, FaBoxes, FaMoneyBill } from "react-icons/fa";
import SelectBox, { type Box } from "../../components/SelectBox";
import { useTranslation } from "react-i18next";

export default function Tools() {
  const { t } = useTranslation();
  const selectbox: Box[] = [
    {
      path: "/tools/barcodeGenerator",
      icon: <FaBarcode />,
      name: t("Barcode Generator"),
      color: "bg-green-500",
      start: "0px",
      duration: "duration-800",
    },
    {
      path: "/tools/units",
      icon: <FaBoxes />,
      name: t("Units"),
      color: "bg-sky-500",
      start: "80px",
      duration: "duration-900",
      permission: "units",
    },

    {
      path: "/tools/currency",
      icon: <FaMoneyBill />,
      name: t("Currency"),
      color: "bg-red-400",
      start: "160px",
      duration: "duration-1000",
      permission: "currency",
    },
  ];
  return <SelectBox items={selectbox} />;
}
