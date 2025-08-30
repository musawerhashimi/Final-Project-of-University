import { useTranslation } from "react-i18next";
import RouteBox from "../../../../components/RouteBox";
import VendorCard from "./VendorCard";
import CreateContactPage from "./vendorForm/CreateVendorForm";

export default function VendorsList() {
  const { t } = useTranslation();
  const routebox = [
    { path: "/purchase", name: t("Purchase") },
    { path: "/purchase/vendors", name: t("Vendors") },
  ];
  return (
    <>
      <RouteBox items={routebox} routlength={routebox.length} />

      <CreateContactPage />
      <div className="mt-2 rounded-lg bg-gradient-to-r from-blue-50 to-green-100 p-2 m-4">
        <h1 className="p-2 text-3xl font-bold text-center border-b-2 border-sky-500 text-sky-800">
          {t("Vendor List")}
        </h1>

        <div className="p-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  ">
          <VendorCard />
        </div>
      </div>
    </>
  );
}
