export interface Location {
  id: number;
  name: string;
  address: string;
  total_products: number;
  total_quantity: number;
  location_type: "warehouse" | "store";
}