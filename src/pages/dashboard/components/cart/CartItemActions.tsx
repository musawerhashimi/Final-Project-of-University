import { useTranslation } from "react-i18next";
import { FaHistory, FaUndo, FaTrash } from "react-icons/fa";
import type { CartItemData } from "../../../../entities/CartItemData";

interface CartItemActionsProps {
  item: CartItemData;
  onDelete: (id: number) => void;
  onReturn: (id: number) => void;
  onShowHistory: (id: number) => void;
}

export default function CartItemActions({
  item,
  onDelete,
  onReturn,
  onShowHistory,
}: CartItemActionsProps) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={() => onDelete(item.id)}
        className={`p-0 transition-colors duration-300 bg-error hover:bg-error-hover text-white rounded`}
        title="Delete"
        type="button"
      >
        <FaTrash className="inline" /> {t("delete")}
      </button>
      <button
        onClick={() => onReturn(item.id)}
        className={`p-0 transition-colors duration-300 bg-warning text-black hover:bg-warning-hover rounded`}
        title="Return"
        type="button"
      >
        <FaUndo className="inline" /> {t("return")}
      </button>

      <button
        onClick={() => onShowHistory(item.variant)}
        className={`p-0 transition-colors duration-300 bg-teal hover:bg-teal-hover text-white rounded`}
        type="button"
      >
        <FaHistory className="inline me-1" /> {t("productHistory")}
      </button>
    </div>
  );
}
