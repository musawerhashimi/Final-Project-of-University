import type { RelativeUnits } from "./RelativeUnits";


export interface Product {
  id: number;
  inventory: number;
  name: string;
  barcode: string;
  quantity: number;
  cost_price: number;
  selling_price: number;
  cost_currency: number;
  selling_currency: number;
  unit_id: number;
  relativeUnits?: RelativeUnits[];
}
