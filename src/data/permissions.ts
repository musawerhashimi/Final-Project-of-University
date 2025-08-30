export const permissions = [
  { name: "users", value: "Users" },
  { name: "inventory", value: "Inventory" },
  { name: "sales", value: "Sales" },
  { name: "purchases", value: "Purchases" },
  { name: "customers", value: "Customers" },
  { name: "finance", value: "Finance" },
  { name: "reports", value: "Reports" },
  { name: "settings", value: "Settings" },

  { name: "product_details", value: "Product Details" },
  { name: "expense", value: "Expense" },
  { name: "stock_and_warehouse", value: "Stock and Warehouse" },
  { name: "currency", value: "Currency" },
  { name: "units", value: "Units" },
  { name: "discount", value: "Discount" },
  
  // { name: "members", value: "Members" },
  // { name: "employees", value: "Employees" },
  // Will Be Used Later in the Future
  // { name: "products", value: "Products" },
  // { name: "vendors", value: "Vendors" },
] as const;

export type Permission = (typeof permissions)[number]["name"];

export const routePermissions: Record<string, Permission | Permission[]> = {
  "/": ["sales", "inventory"],
  "/product-details/:productId": "product_details",

  "/dashboard/expense": "expense",
  "/dashboard/customer": "customers",

  "/sale-payment": "sales",
  "/add-purchase": "purchases",
  "/sales": "sales",
  "/purchase": "purchases",

  "/finance": "finance",
  "/customers": "customers",
  "/customers/:id": "customers",
  "/customers/:id/statement": "customers",

  "/purchase/vendors": "purchases",
  "/purchase/vendors/:id": "purchases",
  "/purchase/purchaseList": "purchases",
  "/purchase/purchaseList/purchaseListDetails/:id": "purchases",

  "/finance/members": "finance",
  "/finance/monthlyPayments": "finance",
  "/finance/paymentsReceive": "finance",
  "/finance/resources": "finance",
  "/finance/employees": "finance",

  "/stockAndWarehouse": "stock_and_warehouse",

  "/reports": "reports",
  "/reports/quickReport": "reports",
  "/reports/monthlyReport": "reports",
  "/reports/:month-year": "reports",
  "/reports/monthlyReport/:year/:month": "reports",
  "/reports/salesReport": "reports",
  "/reports/StockWarehouseReport/:location_id": "reports",
  "/reports/StockWarehouseReport": "stock_and_warehouse",
  "/reports/customerReport": "customers",
  "/reports/transactionReport": "reports",
  "/reports/UserCashFlow": "currency",

  "/tools/units": "units",
  "/tools/currency": "currency",

  "/settings/general-settings": "settings",
  "/settings/users": "users",
  "/settings/users/:userId/profile": "users",
};

export const hasRoutePermission = (
  route: string,
  permissions: Permission[]
) => {
  const rp = routePermissions[route];
  if (rp === undefined) return true;
  const perm = Array.isArray(rp) ? rp : [rp];
  return perm.some((p) => permissions.includes(p));
};
