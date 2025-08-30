
export interface InventoryItem {
  id: number;
  variant: number;
  product_name: string;
  batch: string | null;
  image: string | null;
  barcode: string;
  location: number;
  category_id: number;
  department_id: number;
  location_name: string;
  quantity_on_hand: string;
  reserved_quantity: string;
  available_quantity: string;
  unit_id: number;
  cost_price: string;
  cost_currency_id: number;
  selling_price: string;
  selling_currency_id: number;
  is_favorite: boolean;
  is_bookmarked: boolean;
  is_loved: boolean;
  created_at: string;
  updated_at: string;
}
