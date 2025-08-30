import Card from "../../../components/card/Card";
import { FaCheckCircle, FaStar, FaHeart } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import type { InventoryItem } from "../../../entities/InventoryItem";
import { useCurrencyStore, useUnitStore } from "../../../stores";
import { Link } from "react-router-dom";
import { useInventory } from "../../../hooks/inventory/useInventory";
import { Can } from "../../../providers/Can";

interface Props {
  product: InventoryItem;
  onAddToCart?: () => void;
}

function ProductCard(props: Props) {
  const { t } = useTranslation();
  const {
    product: {
      product_name,
      image,
      quantity_on_hand,
      unit_id,
      selling_price,
      selling_currency_id,
      variant,
      is_bookmarked,
      is_loved,
      is_favorite,
    },
    onAddToCart,
  } = props;
  const { togglePreference } = useInventory();
  const getCurrency = useCurrencyStore((s) => s.getCurrency);
  const currency = getCurrency(selling_currency_id);
  const getUnitById = useUnitStore((s) => s.getUnitById);
  const unit = getUnitById(unit_id);

  return (
    <Card>
      {/* Icons shown on hover */}
      <div className="absolute w-full bg-black/80 p-2 flex justify-evenly -top-9 group-hover:top-0 transition-all duration-300">
        <FaHeart
          onClick={() => togglePreference(variant, "is_loved")}
          className={`${
            is_loved ? "text-red-500 dark:text-red-400" : "text-gray-400"
          } text-lg cursor-pointer`}
        />

        <FaStar
          onClick={() => togglePreference(variant, "is_favorite")}
          className={`${
            is_favorite
              ? "text-yellow-400 dark:text-yellow-300"
              : "text-gray-400"
          } cursor-pointer text-lg `}
        />

        <FaCheckCircle
          onClick={() => {
            togglePreference(variant, "is_bookmarked");
          }}
          className={`${
            is_bookmarked
              ? "text-green-500 dark:text-green-400"
              : "text-gray-400"
          }  text-xl  cursor-pointer`}
        />
      </div>

      {/* Image */}
      <div className="h-40 overflow-hidden bg-base">
        <img
          src={image || undefined}
          alt={product_name}
          className="w-full h-full object-cover group-hover:scale- transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-semibold truncate">{product_name}</h3>

        <div className="flex items-center justify-between text-sm">
          {/* Quantity + Unit */}
          <span className="text-secondary-front">
            {parseFloat(quantity_on_hand).toFixed(2)} {unit.abbreviation}
          </span>
          {/* Price + Currency */}
          <span className="font-bold">
            {parseFloat(selling_price).toFixed(currency?.decimal_places)}{" "}
            {currency?.code}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Can permission="product_details">
            <Link
              to={"/dashboard/product-details/" + variant}
              className="flex-1 text-center py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300 text-sm"
            >
              {t("card.details")}
            </Link>
          </Can>
          <Can permission="sales">
            <button
              onClick={onAddToCart}
              className="flex-1 py-2 bg-success hover:bg-success-hover text-white rounded-lg transition-colors duration-300 text-sm"
            >
              {t("card.addToCart")}
            </button>
          </Can>
        </div>
      </div>
    </Card>
  );
}

export default ProductCard;
