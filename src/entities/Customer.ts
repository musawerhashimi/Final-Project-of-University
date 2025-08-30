// types/customer.ts

import type { Receipt } from "./Receipt";

export interface ListCustomer {
  id: number;
  name: string;
  birth_date: string | null;
  email: string;
  phone: string;
  address: string;
  city: string;
  photo: string | null;
  gender: "male" | "female" | null;
}

export interface CustomerListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ListCustomer[];
}

export interface CustomerFormData {
  name: string;
  birth_date?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  photo?: File;
  gender?: "M" | "F" | "N";
}


export interface Customer {
  id: number;
  customer_number: string;
  name: string;
  gender: string;
  photo: string;
  email: string;
  phone: string;
  discount_percentage: number;
  balance: string;
  date_joined: string;
  status: string;
  notes: string;
  birth_date: string;
  total_purchases: string;
  purchase_count: number;
  address: string;
  city: string;
  created_by_user_name: string;
  sales: Receipt[];
}

export interface UpdateCustomerRequest {
  name: string;
  birth_date?: string | null;
  email: string;
  phone: string;
  address: string;
  city: string;
  gender: string;
}

export interface PhotoUpdateResponse {
  photo: string;
}