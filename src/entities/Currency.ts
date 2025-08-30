export interface Currency {
  id: number;
  name: string;
  code: string;
  symbol: string;
  exchange_rate: string;
  is_base_currency: boolean;
  decimal_places: number;
}
