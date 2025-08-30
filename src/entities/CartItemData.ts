import type { Product } from "./Product";

export interface CartItemData extends Product {
  available: number;
  quantityPrice: number;
  discountPrice: number;
  quantityCurrency: number;
  discountCurrency: number;
  discountPercent: number;
  notes: string;
  variant: number;
}
