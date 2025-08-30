interface CustomerStatement {
  customer_id_card: number;
  amount: number;
  curenccy: string;
  type: "cash" | "loan";
  description: string;
  opening: "yes" | "no";
  session: number;
  added_by: string;
  date: string;
}

const customerStatement: CustomerStatement[] = [
  {
    customer_id_card: 1,
    amount: 2000,
    curenccy: "USD",
    type: "cash",
    description: "For musawer hashimi",
    opening: "no",
    session: 23378746367,
    added_by: "Ahmmad",
    date: "03/07/2025,10:37AM",
  },
  {
    customer_id_card: 1,
    amount: 2000,
    curenccy: "USD",
    type: "cash",
    description: "For musawer hashimi",
    opening: "no",
    session: 23378746367,
    added_by: "Ahmmad",
    date: "03/07/2025,10:37AM",
  },
  {
    customer_id_card: 1,
    amount: 2000,
    curenccy: "USD",
    type: "cash",
    description: "For musawer hashimi",
    opening: "no",
    session: 23378746367,
    added_by: "Ahmmad",
    date: "03/07/2025,10:37AM",
  },
  {
    customer_id_card: 1,
    amount: -1000,
    curenccy: "USD",
    type: "loan",
    description: "For musawer hashimi",
    opening: "no",
    session: 23378746367,
    added_by: "Ahmmad",
    date: "03/07/2025,10:37AM",
  },
  {
    customer_id_card: 1,
    amount: 2000,
    curenccy: "USD",
    type: "cash",
    description: "For musawer hashimi",
    opening: "no",
    session: 23378746367,
    added_by: "Ahmmad",
    date: "03/07/2025,10:37AM",
  },
  {
    customer_id_card: 1,
    amount: -2000,
    curenccy: "USD",
    type: "loan",
    description: "For musawer hashimi",
    opening: "no",
    session: 23378746367,
    added_by: "Ahmmad",
    date: "03/07/2025,10:37AM",
  },
];
export default customerStatement;
