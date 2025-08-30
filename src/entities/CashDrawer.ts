export interface CashDrawer {
  id: number;
  name: string;
  description?: string;
  location: number;
  amounts: CashDrawerMoney[];
}

export interface CashDrawerMoney {
  id: number;
  currency: number;
  value: string;
}
