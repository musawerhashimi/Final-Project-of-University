import { useState, useCallback, useMemo } from "react";
import type { CartItemData } from "../../../../entities/CartItemData";
import CartItemHeader from "./CartItemHeader";
import CartItemForm from "./CartItemForm";
import CartItemActions from "./CartItemActions";
import { useCurrencyStore } from "../../../../stores";
import { useNavigate } from "react-router-dom";

interface CartItemProps {
  item: CartItemData;
  onUpdate: (updated: CartItemData) => void;
  onDelete: (id: number) => void;
}

export default function CartItem({ item, onUpdate, onDelete }: CartItemProps) {
  const [expanded, setExpanded] = useState(false);
  const toggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleUpdate = useCallback(
    (updatedItem: CartItemData) => {
      onUpdate(updatedItem);
    },
    [onUpdate]
  );

  const handleReturn = useCallback((id: number) => {
    console.log("Return item:", id);
  }, []);

  const navigate = useNavigate();

  const handleShowHistory = useCallback(
    (id: number) => {
      navigate(`dashboard/product-details/${id}`);
    },
    [navigate]
  );

  const convertCurrency = useCurrencyStore((s) => s.convertCurrency);
  const isLoss = useMemo(() => {
    const convertedSellPrice = convertCurrency(
      item.selling_price,
      item.selling_currency,
      item.cost_currency
    );
    return item.cost_price > convertedSellPrice;
  }, [
    convertCurrency,
    item.cost_currency,
    item.cost_price,
    item.selling_currency,
    item.selling_price,
  ]);

  return (
    <li
      className={`border-b ${
        isLoss && "border-s-3"
      } border-s-error border-border-color last:border-b-0`}
    >
      <CartItemHeader item={item} expanded={expanded} onToggle={toggle} />

      <div
        className={`overflow-hidden transition-all ease-linear overflow-y-auto duration-300 rounded-b ${
          expanded ? `h-[450px]` : "h-0"
        }`}
      >
        <div className="space-y-4 p-2 mt-1 text-sm">
          <CartItemForm item={item} onUpdate={handleUpdate} />

          <CartItemActions
            item={item}
            onDelete={onDelete}
            onReturn={handleReturn}
            onShowHistory={handleShowHistory}
          />
        </div>
      </div>
    </li>
  );
}
