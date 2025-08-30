import type { Category } from "./Category";

export interface Department {
  id: number;
  name: string;
  description?: string;
  total_products: number;
  total_quantity: number;
  categories: Category[];
}
