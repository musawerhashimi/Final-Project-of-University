import { FaAngleLeft, FaAngleRight, FaTimes } from "react-icons/fa";
import SliderButton from "../../../components/SliderButton";
import { useDirection } from "../../../hooks/useDirection";
import { useCartStore } from "../../../stores/useCartStore";
import Cart from "./cart/Cart";
import { useTranslation } from "react-i18next";
import { useCurrencyStore } from "../../../stores";
import type { SaleCustomer } from "../../../entities/SaleCustomer";
import { useState } from "react";
import CustomerFilterInput from "../../addPurchase/components/CustomerFilterInput";

function RightSide() {
  const toggleCart = useCartStore((s) => s.toggleCart);
  const isOpen = useCartStore((s) => s.isOpen);
  const { t } = useTranslation();
  const dir = useDirection();

  const getBaseCurrency = useCurrencyStore((s) => s.getBaseCurrency);
  const baseCurrency = getBaseCurrency();
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  const customer = useCartStore((s) => s.customer);
  const setCustomer = useCartStore((s) => s.setCustomer);
  const getCustomers = useCartStore((s) => s.getCustomers);

  const [customers, setCustomers] = useState<SaleCustomer[]>([]);
  const [customerFilter, setCustomerFilter] = useState("");
  return (
    <>
      <SliderButton
        className="fixed top-50 end-0 text-white bg-gray-950 z-20"
        isRotate={isOpen}
        onClick={toggleCart}
      >
        {isOpen === (dir === "ltr") ? <FaAngleRight /> : <FaAngleLeft />}
      </SliderButton>

      <div
        className={`transition-[width,padding] duration-500 absolute box-border bg-base h-full overflow-y-auto end-0 z-10 lg:static flex flex-col space-y-3 py-4 pt-0.5 ${
          isOpen ? "px-2 w-[calc(var(--spacing)*84)]" : "w-0"
        }`}
      >
        <div className="my-0.5"></div>

        {customer ? (
          <div className="flex justify-between relative border border-border-color p-2 rounded-lg overflow-hidden">
            <span>{customer.name}</span>
            <span>
              {formatPriceWithCurrency(
                parseFloat(customer.balance),
                baseCurrency.id
              )}
            </span>
            <span></span>
            <span
              onClick={() => setCustomer()}
              className="absolute bg-error hover:bg-error-hover p-3 top-0 end-0 transition-colors duration-200"
            >
              <FaTimes />
            </span>
          </div>
        ) : (
          <>
            <CustomerFilterInput
              placeholder={t("customer")}
              items={customers}
              value={customerFilter}
              onChangeInput={(value) => {
                getCustomers(value).then((data) => setCustomers(data));
                setCustomerFilter(value);
              }}
              onSelectItem={setCustomer}
            />
          </>
        )}
        <Cart />
      </div>
    </>
  );
}

export default RightSide;
