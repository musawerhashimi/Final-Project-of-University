export interface Transaction {
  id: number;
  transaction_type: "pay" | "receive";
  party_type: "employees" | "members" | "customers" | "vendors";
  party_id: number;
  amount: number;
  currency: number;
  date: string;
  cash_drawer: number;
  description?: string;
}

export interface ListTransaction {
  id: 23;
  transaction_type: string;
  party_type: string;
  party_id: number;
  amount: string;
  currency: number;
  cash_drawer: number;
  reference_type: string;
  reference_id: number;
  transaction_date: string;
  description: string;
  created_by_user_name: "Suhail Sirat";
  created_at: "2025-07-17T12:31:43.121846+04:30";
}

export interface DirectTransaction {
  id: number;
  transaction_date: string;
  amount: string;
  currency: number;
  description: string;
  party_type: string;
  cash_drawer_id: number;
  party_name: string;
  transaction_type: "pay" | "receive";
}
