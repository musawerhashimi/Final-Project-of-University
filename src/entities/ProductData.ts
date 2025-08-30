import type { Product } from "./Product";


export interface ProductData extends Product {
  image: string;
  loved?: boolean;
  favorite?: boolean;
  checked?: boolean;
}
