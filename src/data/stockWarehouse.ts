interface StockWarehouse {
  name: string;
  location: string;
  type: "stock" | "warehouse";
}

const stock_warehouse: StockWarehouse[] = [
  {
    name: "Branch A",
    location: "Kabul,AFG",
    type: "stock",
  },
  {
    name: "Godam A",
    location: "Kabul,AFG",
    type: "warehouse",
  },
  {
    name: "Godam G",
    location: "Kabul,AFG",
    type: "warehouse",
  },
  {
    name: "Branch B",
    location: "Kabul,AFG",
    type: "stock",
  },
  {
    name: "Branch C",
    location: "Kabul,AFG",
    type: "stock",
  },
  {
    name: "Godam B",
    location: "Kabul,AFG",
    type: "warehouse",
  },
  {
    name: "Godam C",
    location: "Kabul,AFG",
    type: "warehouse",
  },
];

export default stock_warehouse;
