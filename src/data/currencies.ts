export interface Currency {
  id: number;
  name: string;
  symbol: string;
  exchange_rate: number;
  decimal_places: number;
}

const currencies: Currency[] = [
  {
    id: 1,
    name: "USD",
    symbol: "$",
    exchange_rate: 1,
    decimal_places: 2,
  },
  {
    id: 2,
    name: "EUR",
    symbol: "$",
    exchange_rate: 0.95,
    decimal_places: 2,
  },
  {
    id: 3,
    name: "GBP",
    symbol: "$",
    exchange_rate: 5.9,
    decimal_places: 1,
  },
  {
    id: 4,
    name: "JPY",
    symbol: "$",
    exchange_rate: 80,
    decimal_places: 0,
  },
  {
    id: 5,
    name: "AFG",
    symbol: "$",
    exchange_rate: 79,
    decimal_places: 0,
  },
];

export default currencies;
