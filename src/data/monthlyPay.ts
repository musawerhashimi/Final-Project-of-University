export interface MonthlyPaymentType {
  id: number;
  payment_name: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  description: string;
  transaction_category: string;
  transaction_name: string;
  resources: string;
}

const initialPayments: MonthlyPaymentType[] = [
  {
    id: 1,
    payment_name: "Musawer Hashimi",
    amount: 3500.0,
    currency: "USD",
    startDate: "2024-01-01",
    endDate: "2024-07-01",
    description: "Monthly salary for Senior Developer",
    transaction_category: "Expance",
    transaction_name: "Ahmad",
    resources: "Cash Resource",
  },
  {
    id: 2,
    payment_name: "Suhail Sirat",
    amount: 2800.0,
    currency: "EUR",
    startDate: "2024-03-15",
    endDate: "2024-08-01",
    description: "Monthly salary for Marketing Specialist",
    transaction_category: "Expance",
    transaction_name: "Ahmad",
    resources: "Cash Resource",
  },
  {
    id: 3,
    payment_name: "Edris",
    amount: 2700.0,
    currency: "AFG",
    startDate: "2024-03-15",
    endDate: "2024-08-01",
    description: "Monthly salary for Marketing Specialist",
    transaction_category: "Expance",
    transaction_name: "Ahmad",
    resources: "Cash Resource",
  },
  {
    id: 4,
    payment_name: "Hekmat",
    amount: 280.0,
    currency: "USD",
    startDate: "2024-03-15",
    endDate: "2024-08-01",
    description: "Monthly salary for Marketing Specialist",
    transaction_category: "Expance",
    transaction_name: "Bil Pay",
    resources: "Cash Resource",
  },
  {
    id: 5,
    payment_name: "KAmran",
    amount: 28.0,
    currency: "USD",
    startDate: "2024-03-15",
    endDate: "2024-08-01",
    description: "Monthly salary for Marketing Specialist",
    transaction_category: "Emplooey",
    transaction_name: "Musawer",
    resources: "Cash Resource",
  },
  {
    id: 6,
    payment_name: "me",
    amount: 28.0,
    currency: "USD",
    startDate: "2024-03-15",
    endDate: "2024-08-01",
    description: "Monthly salary for Marketing Specialist",
    transaction_category: "Emplooey",
    transaction_name: "Musawer",
    resources: "Cash Resource",
  },
];
export default initialPayments;
