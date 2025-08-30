import { memo } from "react";
import Badge from "../../../../components/Badge";
import type { CartItemData } from "../../../../entities/CartItemData";
import { useCartStore } from "../../../../stores/useCartStore";
import { useTranslation } from "react-i18next";
import { useCurrencyStore, useUnitStore } from "../../../../stores";

interface CartItemHeaderProps {
  item: CartItemData;
  expanded: boolean;
  onToggle: () => void;
}

const CartItemHeader = memo(
  ({ item, expanded, onToggle }: CartItemHeaderProps) => {
    const formatPriceWithCurrency = useCurrencyStore(
      (s) => s.formatPriceWithCurrency
    );
    const convertCurrency = useCurrencyStore((s) => s.convertCurrency);
    const getUnitById = useUnitStore((s) => s.getUnitById);
    const subtotalCurrencyId = useCartStore((s) => s.subtotalCurrencyId);
    const { t } = useTranslation();
    return (
      <div
        className="flex justify-between h-[90px] items-center p-2 cursor-pointer hover:bg-hover transition-colors duration-200 rounded-t"
        onClick={onToggle}
        role="button"
        aria-expanded={expanded}
        aria-label={`Toggle details for ${item.name}`}
      >
        <div className="flex-1 min-w-0">
          <p
            className="text-primary-front font-medium truncate"
            title={item.name}
          >
            {item.name}
          </p>
          <div className="flex flex-wrap gap-1 py-1">
            <Badge color="blue">{item.id}</Badge>
            <Badge>
              {t("cartItemHeader.quantity")}: {item.quantity}{" "}
              {getUnitById(item.unit_id).abbreviation}
            </Badge>
          </div>
          <div>
            <Badge color="green">
              {t("cartItemHeader.available")}: {item.available}
            </Badge>
          </div>
        </div>

        <div className="text-end min-w-0 ml-2">
          <p
            className="text-primary-front font-medium truncate"
            title={formatPriceWithCurrency(
              item.selling_price,
              item.selling_currency
            )}
          >
            {formatPriceWithCurrency(
              convertCurrency(
                item.selling_price,
                item.selling_currency,
                subtotalCurrencyId
              ),
              subtotalCurrencyId
            )}
          </p>
          {item.discountPercent > 0 && (
            <p className="text-xs py-1 text-secondary-front truncate">
              {t("cart.discount")} {item.discountPercent.toFixed(0)}%
            </p>
          )}
          <p dir="ltr" className="text-xs py-1 text-secondary-front truncate">
            ({" "}
            {formatPriceWithCurrency(item.quantityPrice, item.quantityCurrency)}{" "}
            ) / {getUnitById(item.unit_id).name}
          </p>
        </div>
      </div>
    );
  }
);

export default CartItemHeader;
