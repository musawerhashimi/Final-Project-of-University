import { useTranslation } from "react-i18next";
import { useVendorStore } from "../../../../../stores";
import ContactForm from "./VendorAddform";

interface Props {
  id: number;
}
function UpdateContactPage({ id }: Props) {
  const { vendors } = useVendorStore();
  const { t } = useTranslation();
  const vendor = vendors.find((v) => v.id === id);

  if (!vendor) {
    return (
      <div>
        <p className="text-red-500 text-center mt-3">{t("Vendor not found")}</p>
      </div>
    );
  }
  return <ContactForm initialData={vendor} />;
}

export default UpdateContactPage;
