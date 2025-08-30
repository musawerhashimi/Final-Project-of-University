import type { Price, Product } from "./products";

export interface CartItemData extends Product {
  available: number;
  pricePerQty: Price;
  discountPrice: Price;
  discountPercent: number;
  notes: string;
};


const cartItems: CartItemData[] = [
  {
    id: 1,
    name: "Apple",
    quantity: 100,
    unit: "kg",
    realPrice: { price: 10, currencyId: 0 },
    sellPrice: { price: 15, currencyId: 2 },
    pricePerQty: { price: 2, currencyId: 0 },
    available: 100,
    discountPrice: { price: 0, currencyId: 0 },
    discountPercent: 0,
    notes: "",
  },
  {
    id: 2,
    name: "Milk",
    quantity: 2,
    unit: "liters",
    available: 100,
    realPrice: {price: 10, currencyId: 0},
    sellPrice: {price: 12, currencyId: 0},
    pricePerQty: {price: 2, currencyId: 0},
    discountPrice: { price: 3.5, currencyId: 0 },
    discountPercent: 12.5,
    notes: "Low-fat milk",
  },
  {
    id: 3,
    name: "Bread",
    quantity: 3,
    unit: "loaves",
    available: 100,
    realPrice: {price: 10, currencyId: 0},
    sellPrice: {price: 12, currencyId: 0},
    pricePerQty: {price: 2, currencyId: 0},
    discountPrice: { price: 5, currencyId: 0 },
    discountPercent: 16.67,
    notes: "Whole grain bread",
  },
  {
    id: 4,
    name: "Navy",
    quantity: 4,
    unit: "kg",
    available: 100,
    realPrice: {price: 10, currencyId: 0},
    sellPrice: {price: 12, currencyId: 0},
    pricePerQty: {price: 2, currencyId: 0},
    discountPrice: { price: 8, currencyId: 0 },
    discountPercent: 20,
    notes: "Juicy oranges",
  },
  {
    id: 5,
    name: "Eggs",
    quantity: 12,
    unit: "pieces",
    available: 100,
    realPrice: {price: 10, currencyId: 0},
    sellPrice: {price: 12, currencyId: 0},
    pricePerQty: {price: 2, currencyId: 0},
    discountPrice: { price: 2.5, currencyId: 0 },
    discountPercent: 16.67,
    notes: "Farm fresh eggs",
  },
  {
    id: 6,
    name: "Cheese",
    quantity: 1,
    unit: "kg",
    available: 100,
    realPrice: {price: 10, currencyId: 0},
    sellPrice: {price: 12, currencyId: 0},
    pricePerQty: {price: 2, currencyId: 0},
    discountPrice: { price: 7, currencyId: 0 },
    discountPercent: 12.5,
    notes: "Cheddar cheese",
  },
  {
    id: 7,
    name: "Tomato",
    quantity: 3,
    unit: "kg",
    available: 100,
    realPrice: {price: 10, currencyId: 0},
    sellPrice: {price: 12, currencyId: 0},
    pricePerQty: {price: 2, currencyId: 0},
    discountPrice: { price: 7.5, currencyId: 0 },
    discountPercent: 16.67,
    notes: "Fresh tomatoes",
  },
  {
    id: 8,
    name: "Potato",
    quantity: 5,
    unit: "kg",
    available: 100,
    realPrice: {price: 10, currencyId: 0},
    sellPrice: {price: 12, currencyId: 0},
    pricePerQty: {price: 2, currencyId: 0},
    discountPrice: { price: 8, currencyId: 0 },
    discountPercent: 20,
    notes: "Organic potatoes",
  },
];

export default cartItems;
