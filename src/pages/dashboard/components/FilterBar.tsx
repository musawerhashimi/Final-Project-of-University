import { ScanLineIcon } from "lucide-react";
import { useInventoryFilters } from "../../../hooks/inventory/useInventoryFilters";
import { useInventoryStore } from "../../../stores/useInventoryStore";
import type { ShowCard, ShowFilter } from "../Dashboard";
import { Can } from "../../../providers/Can";
import { useTranslation } from "react-i18next";
interface Props {
  setShowCard: (filter: ShowCard) => void;
  showCard: ShowCard;
  toggleBarcode: () => void;
  barcodeEnabled: boolean;
}

function FilterBar({
  setShowCard,
  showCard: showItem,
  toggleBarcode,
  barcodeEnabled,
}: Props) {
  const {
    filters,
    searchQuery,
    setSearchQuery,
    toggleLoved,
    toggleBookmarked,
    toggleFavorite,
  } = useInventoryFilters();
  const updateFilter = useInventoryStore((s) => s.updateFilter);
  const toggle = (filter: ShowFilter) => {
    if (showItem === filter || filters[filter]) {
      updateFilter(filter, undefined);
      setShowCard("items");
      return;
    }
    updateFilter("category_id", undefined);
    updateFilter("department_id", undefined);
    updateFilter("warehouse_id", undefined);
    setShowCard(filter);
  };
  const { t } = useTranslation();
  return (
    <div className="px-4 pt-2 p-1">
      <div className="relative">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("Scan Barcode or Search for Items")}
          className="mt-1 block w-full px-3 py-2
        border border-gray-300
        dark:border-gray-600 rounded-md shadow-sm
        placeholder-gray-400 focus:outline-none
        focus:ring-indigo-500 focus:border-indigo-500
        text-gray-900 dark:text-gray-100
        transition-colors duration-200"
        />
        <Can permission="sales">
          <button
            type="button"
            onClick={toggleBarcode}
            className={`
          absolute end-2 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors duration-200
          ${
            barcodeEnabled
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          }
        `}
            title="Toggle Barcode Mode"
          >
            <ScanLineIcon className="w-5 h-5" />
          </button>
        </Can>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-6 pt-2 gap-2">
        <FilterToggle
          active={filters.is_loved}
          onClick={() => toggleLoved(filters.is_loved ? undefined : true)}
          label={t("❤️ Loved")}
        />
        <FilterToggle
          active={filters.is_favorite}
          onClick={() => toggleFavorite(filters.is_favorite ? undefined : true)}
          label={t("⭐ Favorite")}
        />
        <FilterToggle
          active={filters.is_bookmarked}
          onClick={() =>
            toggleBookmarked(filters.is_bookmarked ? undefined : true)
          }
          label={t("✅ Bookmarked")}
        />
        <FilterToggle
          active={showItem === "category_id" || !!filters.category_id}
          onClick={() => toggle("category_id")}
          label={t("✨ Categories")}
        />
        <FilterToggle
          active={showItem === "department_id" || !!filters.department_id}
          onClick={() => toggle("department_id")}
          label={t("🏬 Departments")}
        />
        <FilterToggle
          active={showItem === "warehouse_id" || !!filters.warehouse_id}
          onClick={() => toggle("warehouse_id")}
          label={t("🏬 Warehouses")}
        />
      </div>
    </div>
  );
}

export default FilterBar;

function FilterToggle({
  active,
  onClick,
  label,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`py-1 rounded-full text-sm font-medium transition-colors ${
        active
          ? "bg-blue-500 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}
