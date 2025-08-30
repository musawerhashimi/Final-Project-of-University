import { useTranslation } from "react-i18next";
import Dropdown from "../../../../components/Dropdown";
import { useAddPurchaseStore, useCurrencyStore } from "../../../../stores";
import CartItem from "./CartItem";
import type { Vendor } from "../../../../entities/Vendor";

interface Props {
  editItem: (id: number) => void;
  removeItem: (id: number) => void;
  selectedVendor?: Vendor;
  setVendorError: (error: string) => void;
  onPurchase: () => void;
}

const Cart = ({
  editItem,
  removeItem,
  onPurchase,
  selectedVendor,
  setVendorError,
}: Props) => {
  const { t } = useTranslation();

  const items = useAddPurchaseStore((s) => s.items);
  const getSubtotal = useAddPurchaseStore((s) => s.getSubtotal);
  const currency = useAddPurchaseStore((s) => s.currency);
  const setCurrency = useAddPurchaseStore((s) => s.setCurrency);
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  const getCurrency = useCurrencyStore((s) => s.getCurrency);
  const currencies = useCurrencyStore((s) => s.currencies);

  const selectedCurrency = getCurrency(currency)!;
  return (
    <div className="group relative border-t border-border-color shadow-md shadow-black rounded overflow-hidden flex flex-col flex-1">
      <div className="overflow-y-auto flex-1">
        {items.length === 0 ? (
          <p className="p-4 text-center text-secondary-front">
            {t("Purchase Cart Empty")}
          </p>
        ) : (
          <ul>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdate={editItem}
                onDelete={removeItem}
              />
            ))}
          </ul>
        )}
      </div>
      <div>
        <div className="flex justify-between subtotal text-primary-front text-lg p-2 border-y border-border-color">
          <span className="font-bold">{t("cart.subtotal")}</span>
          <span className="font-bold">
            {formatPriceWithCurrency(getSubtotal(), currency)}
          </span>
          <span className="hidden subtotalCurrency">
            <Dropdown
              items={currencies.map((c) => ({
                key: c.id,
                value: c.code,
              }))}
              defaultItem={{
                key: selectedCurrency.id,
                value: selectedCurrency.code,
              }}
              onChange={(currencyId) =>
                setCurrency(parseInt(currencyId.toString()))
              }
            />
          </span>
        </div>
      </div>

      <button
        onClick={() => {
          if (selectedVendor) {
            setVendorError("");
            onPurchase();
          } else {
            setVendorError(t("Vendor is Required"));
          }
        }}
        className="bg-success hover:bg-success-hover transition-[transform,background-color] duration-300 font-semibold text-white p-1 cursor-pointer"
      >
        {t("Purchase")}
      </button>
    </div>
  );
};

export default Cart;
