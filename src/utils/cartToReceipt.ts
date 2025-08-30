import type { CartItemData } from "../entities/CartItemData";
import type { ReceiptItem } from "../entities/Receipt";

export function cartToReceipt(item: CartItemData, getSubtotal: (id: number) => number): ReceiptItem {
  return {
    name: item.name,
    inventory: item.inventory,
    quantity: item.quantity,
    price: item.selling_price,
    discount: item.discountPrice,
    subtotal: getSubtotal(item.id),
  }
}