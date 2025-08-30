type Amount = {
  name: string;
  value: number;
};
export interface Resources {
  name: string;
  descriptions: string;
  amount: Amount[];
}

const resources: Resources[] = [
  {
    name: "Cash Drawer",
    descriptions: "Bank Drawer fro moveing money to bank",
    amount: [
      { name: "USD", value: 1000000 },
      { name: "AFg", value: 2000000 },
      { name: "POU", value: 3000000 },
      { name: "PKS", value: 4000000 },
    ],
  },
  {
    name: "Bank",
    descriptions: "Bank Drawer fro moveing money to bank",
    amount: [
      { name: "USD", value: 1000000 },
      { name: "AFg", value: 2000000 },
      { name: "POU", value: 3000000 },
    ],
  },
  {
    name: "Center Branch",
    descriptions: "Bank Drawer fro moveing money to bank",
    amount: [
      { name: "USD", value: 70000 },
      { name: "AFG", value: 200000 },
    ],
  },
];
export default resources;
