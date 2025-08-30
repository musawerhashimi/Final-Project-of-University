export type TransactionCategory =
  | "employees"
  | "members"
  | "customers"
  | "expenses";
export type TransactionType = "pay" | "receive"; // Changed from PaymentType for clarity

export const members = [
  { id: 1, name: "Member One" },
  { id: 2, name: "Member Two" },
];

export const customers = [
  { id: 1, name: "Customer A" },
  { id: 2, name: "Customer B" },
];

export const expenses = [
  { id: 1, name: "Internet Bill" },
  { id: 2, name: "Electricity Bill" },
];
