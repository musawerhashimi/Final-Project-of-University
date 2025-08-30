import type { SaleCustomer } from "./SaleCustomer";
import type { SalePaymentData } from "./SalePayment";

export type ReceiptItem = {
  id?: number;
  inventory: number;
  name: string;
  quantity: number;
  price: number;
  discount?: number;
  subtotal: number;
};

export interface Receipt {
  id: number;
  sale_date: string;
  receipt_id: string;
  user: string | null;
  type: string;
  currency: number;
  status: string;
  items: ReceiptItem[];
  subtotal: string;
  discount_amount: string;
  total_amount: string;
  item_count: number;
  tenders: SalePaymentData[];
  customer?: SaleCustomer;
  sale_number?: string;
  items_count?: number;
};