import { useTranslation } from "react-i18next";
import Dropdown from "../../../../components/Dropdown";
import { useCartStore } from "../../../../stores/useCartStore";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import { useCurrencyStore } from "../../../../stores";
import { Can } from "../../../../providers/Can";

const Cart = () => {
  const {
    items,
    updateItem,
    removeItem,
    subtotalCurrencyId: subtotalCurrency,
    getTotalAmount,
    setSubtotalCurrency,
    getSubtotal,
  } = useCartStore();
  const { t } = useTranslation();
  const formatPriceWithCurrency = useCurrencyStore(
    (s) => s.formatPriceWithCurrency
  );
  const subtotal = getSubtotal();
  const currencies = useCurrencyStore((s) => s.currencies);
  const getCurrency = useCurrencyStore((s) => s.getCurrency);
  const formatPrice = useCurrencyStore((s) => s.formatPrice);
  const setDiscountPrice = useCartStore((s) => s.setDiscountPrice);

  return (
    <div className="group relative border-t border-border-color shadow-md shadow-black rounded overflow-hidden flex flex-col flex-1">
      <div className="overflow-y-auto flex-1">
        {items.length === 0 ? (
          <p className="p-4 text-center text-secondary-front">
            {t("cart.empty")}
          </p>
        ) : (
          <ul>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdate={updateItem}
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
            {formatPriceWithCurrency(subtotal, subtotalCurrency)}
          </span>
          <span className="hidden subtotalCurrency">
            <Dropdown
              items={currencies.map((c) => ({
                key: c.id,
                value: c.code,
              }))}
              defaultItem={{
                key: subtotalCurrency,
                value: getCurrency(subtotalCurrency).code,
              }}
              onChange={(currencyId) =>
                setSubtotalCurrency(parseInt(currencyId.toString()))
              }
            />
          </span>
        </div>
        <Can permission="discount">
          <div className="flex w-full">
            <div className="flex-1 flex border-e border-indigo focus-within:outline-indigo focus-within:outline-2">
              <span className="flex-1 border-e border-indigo py-1 ps-1">
                {t("Discount Price:")}
              </span>
              <input
                type="number"
                value={formatPrice(getTotalAmount(), subtotalCurrency)}
                step={0.01}
                onChange={(e) => setDiscountPrice(parseFloat(e.target.value))}
                className="p-1 flex-1 w-full border-none focus:outline-0"
              />
            </div>
          </div>
        </Can>
      </div>

      <Link
        to="/sale-payment"
        className="bg-success hover:bg-success-hover text-center transition-[transform,background-color] duration-300 font-semibold text-white p-1 cursor-pointer"
      >
        {t("cart.pay")}
      </Link>
    </div>
  );
};

export default Cart;
