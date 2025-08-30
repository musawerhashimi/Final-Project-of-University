export const roles = [
  // { name: "admin", value: "Administrator" },
  { name: "manager", value: "Manager" },
  // { name: "employee", value: "Employee" },
  { name: "cashier", value: "Cashier" },
  { name: "inventory_manager", value: "Inventory Manager" },
  { name: "sales_rep", value: "Sales Representative" },
  // { name: "accountant", value: "Accountant" },
  { name: "viewer", value: "Viewer" },
] as const;

export type RoleName = (typeof roles)[number]["name"];

export const getRoleNameDisplay = (role: RoleName) => {
  return roles.find((r) => r.name === role)?.value;
};
