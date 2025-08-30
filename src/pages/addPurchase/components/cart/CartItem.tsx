import { useCallback, useState } from "react";
import type { AddPurchaseItemData } from "../../../../entities/AddPurchaseData";
import CartItemHeader from "./CartItemHeader";
import { useTranslation } from "react-i18next";

interface CartItemProps {
  item: AddPurchaseItemData;
  onUpdate: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function CartItem({ item, onUpdate, onDelete }: CartItemProps) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const toggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return (
    <li
      className={`border-b border-s-error border-border-color last:border-b-0`}
    >
      <CartItemHeader item={item} expanded={expanded} onToggle={toggle} />

      <div
        className={`mt-2 overflow-hidden transition-all ease-linear  duration-150 rounded-b ${
          expanded ? `h-[80px]` : "h-0"
        }`}
      >
        <div className="flex justify-evenly m-1.5">
          <button
            onClick={() => onUpdate(item.id)}
            className="hover:text-white flex-1 mx-2 px-4 py-1.5 rounded-lg transition-colors
          duration-300 bg-teal hover:bg-teal-hover"
          >
            {t("Edit")}
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="hover:text-white flex-1 mx-2 px-4 py-1.5 rounded-lg transition-colors
          duration-300 bg-error hover:bg-error-hover"
          >
            {t("Delete")}
          </button>
        </div>
      </div>
    </li>
  );
}
