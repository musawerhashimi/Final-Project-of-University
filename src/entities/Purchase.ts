export interface Purchase {
  id: number;
  purchase_number: string;
  vendor: number;
  purchase_date: string;
  total_amount: string;
  currency: number;
  status: "pending" | "received";
  notes: string;
}

export interface PurchaseItem {
  name: string;
  barcode: number;
  cost_price: number;
  quantity: number;
  unit: string;
}
export interface VendorPurchase {
  id: number;
  purchase_number: string;
  vendor_name: string;
  location_name: string;
  purchase_date: string;
  currency: number;
  total_amount: string;
  notes: string;
  status: "received" | "pending";
  total_items: number;
  total_quantity: number;
}
