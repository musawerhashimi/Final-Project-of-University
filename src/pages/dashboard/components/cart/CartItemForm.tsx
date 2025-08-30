import { memo } from "react";
import FormInput from "../../../../components/FormInput";
import type { CartItemData } from "../../../../entities/CartItemData";
import { createDropdown } from "../../../../utils/createDropdown";
import { useCartItemForm } from "../../../../hooks/useCartItemForm";
import { useTranslation } from "react-i18next";
import { useCurrencyStore, useUnitStore } from "../../../../stores";
import { Can } from "../../../../providers/Can";

export interface CartItemFormProps {
  item: CartItemData;
  onUpdate: (updated: CartItemData) => void;
}

const CartItemForm = memo(({ item, onUpdate }: CartItemFormProps) => {
  const {
    handlePriceChange,
    handleCurrencyChange,
    handleQuantityChange,
    handleDiscountPercentChange,
    handleDiscountPriceChange,
    // handleNotesChange,
    getFieldError,
  } = useCartItemForm({ item, onUpdate });
  const getCurrencyOptions = useCurrencyStore((s) => s.getCurrencyOptions);
  const getDecimalStep = useCurrencyStore((s) => s.getDecimalStep);
  const formatPrice = useCurrencyStore((s) => s.formatPrice);
  const getUnitById = useUnitStore((s) => s.getUnitById);

  const { t } = useTranslation();

  return (
    <div className="space-y-4 mt-1 text-sm">
      {/* Sell Price */}
      <div>
        <FormInput
          placeholder={t("cartItemForm.price")}
          type="number"
          min={0}
          step={getDecimalStep(item.selling_currency)}
          value={formatPrice(item.selling_price, item.selling_currency)}
          onChange={(value) => handlePriceChange(value, "selling_price")}
          rightElements={[
            createDropdown<number>({
              type: "dropdown",
              default: item.selling_currency,
              options: getCurrencyOptions(),
              onChange: (value) =>
                handleCurrencyChange(
                  parseInt(value.toString()),
                  "selling_price",
                  "selling_currency"
                ),
            }),
          ]}
        />
        {getFieldError("sellPrice") && (
          <p className="text-black text-xs mt-1">
            {getFieldError("sellPrice")}
          </p>
        )}
      </div>

      <Can permission="discount">
        {/* Discount Price */}
        <div>
          <FormInput
            placeholder={t("cart.discountPrice")}
            type="number"
            min={0}
            step={getDecimalStep(item.discountCurrency)}
            value={formatPrice(item.discountPrice, item.discountCurrency)}
            onChange={handleDiscountPriceChange}
            rightElements={[
              createDropdown<number>({
                type: "dropdown",
                default: item.discountCurrency,
                options: getCurrencyOptions(),
                onChange: (currency) =>
                  handleCurrencyChange(
                    parseInt(currency.toString()),
                    "discountPrice",
                    "discountCurrency"
                  ),
              }),
            ]}
          />
          {getFieldError("discountPrice") && (
            <p className="text-red-500 text-xs mt-1">
              {getFieldError("discountPrice")}
            </p>
          )}
        </div>

        {/* Discount Percent */}
        <div>
          <FormInput
            placeholder={t("cart.discountPercent")}
            type="number"
            min={0}
            max={100}
            value={item.discountPercent.toFixed(0)}
            onChange={handleDiscountPercentChange}
          />
          {getFieldError("discountPercent") && (
            <p className="text-red-500 text-xs mt-1">
              {getFieldError("discountPercent")}
            </p>
          )}
        </div>
      </Can>

      {/* Quantity */}
      <div>
        <FormInput
          placeholder={t("cartItemForm.quantity")}
          type="number"
          min={1}
          step={0.01}
          max={item.available}
          value={item.quantity.toFixed(2)}
          onChange={handleQuantityChange}
          rightElements={[
            {
              type: "button",
              onClick() {
                console.log("Unit button clicked");
              },
              text: getUnitById(item.unit_id).abbreviation,
            },
          ]}
        />
        {getFieldError("quantity") && (
          <p className="text-red-500 text-xs mt-1">
            {getFieldError("quantity")}
          </p>
        )}
        {item.quantity > item.available && !getFieldError("quantity") && (
          <p className="text-yellow-600 text-xs mt-1 text-center">
            {t("Warning: Quantity exceeds available stock")} ({item.available})
          </p>
        )}
      </div>

      {/* Price Per Quantity */}
      <div>
        <FormInput
          placeholder={t("cartItemForm.quantityPrice")}
          type="number"
          min={0}
          step={getDecimalStep(item.quantityCurrency)}
          value={formatPrice(item.quantityPrice, item.quantityCurrency)}
          onChange={(value) => handlePriceChange(value, "quantityPrice")}
          rightElements={[
            createDropdown<number>({
              type: "dropdown",
              default: item.quantityCurrency,
              options: getCurrencyOptions(),
              onChange: (currency) =>
                handleCurrencyChange(
                  parseInt(currency),
                  "quantityPrice",
                  "quantityCurrency"
                ),
            }),
          ]}
        />
        {getFieldError("pricePerQty") && (
          <p className="text-red-500 text-xs mt-1">
            {getFieldError("pricePerQty")}
          </p>
        )}
      </div>

      {/* Notes */}
      {/* <div>
        <FormInput
          type="textarea"
          placeholder={t("cartItemForm.notes")}
          value={item.notes}
          onChange={handleNotesChange}
        />
        {getFieldError("notes") && (
          <p className="text-red-500 text-xs mt-1">{getFieldError("notes")}</p>
        )}
      </div> */}
    </div>
  );
});

export default CartItemForm;
