
export interface MonthlyPayment {
  id: number;
  name: string;
  amount: string;
  currency: number;
  payment_method: string;
  start_date: string;
  end_date?: string;
  reference_type: "employee" | "expense_category";
  reference_id: number;
  description?: string;
}

export interface References {
  expense_categories: Array<{ id: number; name: string }>;
  employees: Array<{ id: number; name: string }>;
}
