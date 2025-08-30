export interface Price {
  price: number;
  currencyId: number;
}
export interface RelativeUnits {
  name: string;
  exchange_rate: number;
}

export interface Product {
  id: number;
  name: string;
  quantity: number;
  realPrice: Price;
  sellPrice: Price;
  unit: string;
  relativeUnits?: RelativeUnits[];
}

export interface ProductData extends Product {
  image: string;
}

const products: ProductData[] = [
  {
    id: 1,
    name: "Apple",
    quantity: 100,
    unit: "kg",
    image: "images/product.jpg",
    realPrice: { price: 10, currencyId: 1 },
    sellPrice: { price: 15, currencyId: 1 },
  },
  {
    id: 2,
    name: "Apple",
    quantity: 2,
    unit: "liters",
    image: "images/product-2.jpg",
    realPrice: { price: 3, currencyId: 1 },
    sellPrice: { price: 4, currencyId: 1 },
  },
  {
    id: 3,
    name: "Bread",
    quantity: 3,
    unit: "loaves",
    image: "images/product-3.jpg",
    realPrice: { price: 4, currencyId: 3 },
    sellPrice: { price: 6, currencyId: 3 },
  },
  {
    id: 4,
    name: "Orange",
    quantity: 4,
    unit: "kg",
    image: "images/product-2.jpg",
    realPrice: { price: 8, currencyId: 4 },
    sellPrice: { price: 10, currencyId: 4 },
  },
  {
    id: 5,
    name: "Eggs",
    quantity: 12,
    unit: "pieces",
    image: "images/product.jpg",
    realPrice: { price: 2, currencyId: 5 },
    sellPrice: { price: 4, currencyId: 5 },
  },
  {
    id: 6,
    name: "Cheese",
    quantity: 1,
    unit: "kg",
    image: "images/product-3.jpg",
    realPrice: { price: 6, currencyId: 1 },
    sellPrice: { price: 8, currencyId: 1 },
  },
  {
    id: 7,
    name: "Tomato",
    quantity: 3,
    unit: "kg",
    image: "images/product.jpg",
    realPrice: { price: 6, currencyId: 4 },
    sellPrice: { price: 9, currencyId: 4 },
  },
  {
    id: 8,
    name: "Potato",
    quantity: 5,
    unit: "kg",
    image: "images/product-2.jpg",
    realPrice: { price: 8, currencyId: 1 },
    sellPrice: { price: 10, currencyId: 1 },
  },
  {
    id: 9,
    name: "Chicken",
    quantity: 2,
    unit: "kg",
    image: "images/product-3.jpg",
    realPrice: { price: 12, currencyId: 5 },
    sellPrice: { price: 14, currencyId: 5 },
  },
  {
    id: 10,
    name: "Rice",
    quantity: 10,
    unit: "kg",
    image: "images/product.jpg",
    realPrice: { price: 17, currencyId: 3 },
    sellPrice: { price: 20, currencyId: 3 },
  },
  {
    id: 11,
    name: "Sugar",
    quantity: 5,
    unit: "kg",
    image: "images/product-3.jpg",
    realPrice: { price: 13, currencyId: 2 },
    sellPrice: { price: 15, currencyId: 2 },
  },
  {
    id: 12,
    name: "Salt",
    quantity: 2,
    unit: "kg",
    image: "images/product.jpg",
    realPrice: { price: 3, currencyId: 4 },
    sellPrice: { price: 4, currencyId: 4 },
  },
  {
    id: 13,
    name: "Butter",
    quantity: 1,
    unit: "kg",
    image: "images/product-2.jpg",
    realPrice: { price: 4, currencyId: 1 },
    sellPrice: { price: 6, currencyId: 1 },
  },
];

export default products;