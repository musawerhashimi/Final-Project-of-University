// Define the type for an Employee
export interface Employee {
  id: number;
  name: string;
  position: string; // Added position as it was in previous mock data
  phone: string;
  email: string; // New field
}
export const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "فرید",
    position: "دریور",
    phone: "0785171791",
    email: "fareed@example.com",
  },
  {
    id: 2,
    name: "حسین آشیر",
    position: "مدیر",
    phone: "0782345678",
    email: "hussain@example.com",
  },
  {
    id: 3,
    name: "مدیر حسن",
    position: "مدیر",
    phone: "0789876543",
    email: "hasan@example.com",
  },
  {
    id: 4,
    name: "مدیر صبور",
    position: "مدیر",
    phone: "0781122334",
    email: "saboor@example.com",
  },
  {
    id: 5,
    name: "فهیم ضیایی",
    position: "مدیر",
    phone: "0781509017",
    email: "fahim@example.com",
  },
  {
    id: 6,
    name: "سمیر علی زاده",
    position: "مدیر",
    phone: "0787797478",
    email: "sameer@example.com",
  },
  {
    id: 7,
    name: "فردین امیری",
    position: "مدیر",
    phone: "0782922269",
    email: "fardin@example.com",
  },
];
