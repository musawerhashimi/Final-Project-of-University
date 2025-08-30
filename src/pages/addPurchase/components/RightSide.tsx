import { FaAngleLeft, FaAngleRight, FaTimes } from "react-icons/fa";
import SliderButton from "../../../components/SliderButton";
import { useDirection } from "../../../hooks/useDirection";
import { useCartStore } from "../../../stores/useCartStore";
import Cart from "./cart/Cart";
import { useTranslation } from "react-i18next";
import VendorFilterInput from "./VendorFilterInput";
import { useCurrencyStore, useVendorStore } from "../../../stores";
import { useState } from "react";
import type { Vendor } from "../../../entities/Vendor";
import { ChartColumnStackedIcon } from "lucide-react";

interface Props {
  editItem: (id: number) => void;
  removeItem: (id: number) => void;
  onSelectVendor: (vendor: Vendor) => void;
  selectedVendor?: Vendor;
  onClearVendor: () => void;
  onPurchase: () => void;
}

function RightSide(props: Props) {
  const { isOpen, toggleCart } = useCartStore();
  const { t } = useTranslation();
  const dir = useDirection();
  const vendors = useVendorStore((s) => s.vendors);
  const [vendorFilter, setVendorFilter] = useState("");
  const [vendorError, setVendorError] = useState("");
  const currency_id = useCurrencyStore((s) => s.getBaseCurrency().id);
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  return (
    <>
      <SliderButton
        className="fixed top-50 end-0 text-white bg-gray-950"
        isRotate={isOpen}
        onClick={toggleCart}
      >
        {isOpen === (dir === "ltr") ? <FaAngleRight /> : <FaAngleLeft />}
      </SliderButton>

      <div
        className={`transition-[width,padding] duration-500 absolute box-border h-full overflow-y-auto end-0 z-10 lg:static flex flex-col space-y-3 py-4 pt-0.5 ${
          isOpen ? "px-2 w-[calc(var(--spacing)*84)]" : "w-0"
        }`}
      >
        <div className="my-0.5"></div>
        {props.selectedVendor ? (
          <div className="flex justify-between relative border border-border-color p-2 rounded-lg overflow-hidden">
            <span>{props.selectedVendor.name}</span>

            <span>
              <ChartColumnStackedIcon className="inline me-1" />
              {formatPriceWithCurrency(
                Number(props.selectedVendor.balance),
                currency_id
              )}
            </span>
            <span></span>

            <span
              onClick={() => props.onClearVendor()}
              className="absolute bg-error hover:bg-error-hover p-3 top-0 end-0 transition-colors duration-200"
            >
              <FaTimes />
            </span>
          </div>
        ) : (
          <>
            <VendorFilterInput
              placeholder={t("Vendor")}
              items={vendors.filter((v) =>
                v.name.toLowerCase().includes(vendorFilter.toLowerCase())
              )}
              value={vendorFilter}
              onChangeInput={setVendorFilter}
              onSelectItem={props.onSelectVendor}
            />
            {vendorError && (
              <span className="text-red-500 text-sm">{vendorError}</span>
            )}
          </>
        )}

        <Cart {...props} setVendorError={setVendorError} />
      </div>
    </>
  );
}

export default RightSide;
