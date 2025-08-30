import { memo } from "react";
import Badge from "../../../../components/Badge";
import { useTranslation } from "react-i18next";
import type { AddPurchaseItemData } from "../../../../entities/AddPurchaseData";
import {
  useAddPurchaseStore,
  useCurrencyStore,
  useUnitStore,
} from "../../../../stores";

interface CartItemHeaderProps {
  item: AddPurchaseItemData;
  expanded: boolean;
  onToggle: () => void;
}

const CartItemHeader = memo(
  ({ item, expanded, onToggle }: CartItemHeaderProps) => {
    const currency = useAddPurchaseStore((s) => s.currency);

    const getUnitById = useUnitStore((s) => s.getUnitById);

    const selectedUnit = getUnitById(item.product_data.base_unit_id);
    // const getCurrency = useCurrencyStore((s) => s.getCurrency);
    const convertCurrency = useCurrencyStore((s) => s.convertCurrency);
    const formatPriceWithCurrency = useCurrencyStore(
      (s) => s.formatPriceWithCurrency
    );

    const { t } = useTranslation();

    return (
      <div
        className="flex justify-between h-[90px] items-center p-2 cursor-pointer hover:bg-hover transition-colors duration-200 rounded-t"
        onClick={() => onToggle()}
        role="button"
        aria-expanded={expanded}
        aria-label={`Toggle details for ${item.product_data.name}`}
      >
        <div className="flex-1 min-w-0">
          <p
            className="text-primary-front font-medium truncate"
            title={item.product_data.name}
          >
            {item.product_data.name}
          </p>
          <div className="flex flex-wrap gap-1 py-1">
            <Badge color="blue">{item.id}</Badge>
            <Badge>
              {t("cartItemHeader.quantity")}: {item.quantity}{" "}
              {selectedUnit.name}
            </Badge>
          </div>
          <div>
            <Badge color="green">
              {t("reorder")}: {item.product_data.reorder_level}
            </Badge>
          </div>
        </div>

        <div className="text-end min-w-0 ml-2">
          <p className="text-primary-front font-medium truncate">
            {formatPriceWithCurrency(
              convertCurrency(
                item.product_data.variants[0].cost_price * item.quantity,
                item.product_data.variants[0].cost_currency_id,
                currency
              ),
              currency
            )}
          </p>
        </div>
      </div>
    );
  }
);

export default CartItemHeader;
