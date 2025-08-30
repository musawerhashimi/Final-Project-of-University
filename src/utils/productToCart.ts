import type { CartItemData } from "../entities/CartItemData";
import type { InventoryItem } from "../entities/InventoryItem";

export function productToCart(item: InventoryItem): CartItemData {
  return {
    id: item.id,
    barcode: item.barcode,
    inventory: item.id,
    cost_currency: item.cost_currency_id,
    cost_price: parseFloat(item.cost_price),
    name: item.product_name,
    selling_currency: item.selling_currency_id,
    selling_price: parseFloat(item.selling_price),
    unit_id: item.unit_id,
    variant: item.variant,
    quantity: 1,
    available: parseFloat(item.quantity_on_hand),
    quantityPrice: parseFloat(item.selling_price),
    quantityCurrency: item.selling_currency_id,
    discountPrice: 0,
    discountCurrency: item.selling_currency_id,
    discountPercent: 0,
    notes: "",
  };
}
