import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import AddPurchase from "../pages/addPurchase/AddPurchase";
import CustomerProfile from "../pages/customers/components/customer_profile/CustomerProfile";
import CustomerStatement from "../pages/customers/components/customer_profile/CustomerStatement";
import Dashboard from "../pages/dashboard/Dashboard";
import SalePayment from "../pages/dashboard/SalePayment";
import Employees from "../pages/finance/components/Employees";
import Members from "../pages/finance/components/Members";
import MonthlyPayments from "../pages/finance/components/payments/monthlyPayment/MonthlyPayments";
import PaymentsReceive from "../pages/finance/components/payments/paymentRececive/PaymentsReceive";
import Finance from "../pages/finance/Finance";

import Purchase from "../pages/purchase/Purchase";
import CustomerReport from "../pages/reports/components/CustomerReport";

import PrivateRoute from "./PrivateRoute";
import Customers from "../pages/customers/Customers";
import Resources from "../pages/finance/components/Resources";
import LoginPage from "../pages/LoginPage";
import PurchaseList from "../pages/purchase/components/purchase/PurchaseList";
import { UserCashFlow } from "../pages/reports/components/UserCashFlow";
import Reports from "../pages/reports/Reports";
import Sales from "../pages/sales/Sales";
import StockAndWarehouse from "../pages/stock&warehouse/StockAndWarehouse";

import MyCurrency from "../pages/tools/components/Currency";
import Units from "../pages/tools/components/Units";
import Tools from "../pages/tools/Tools";

import ProductDetails from "../pages/dashboard/components/productDetail/ProductDetail";
import CustomerProfileSh from "../pages/dashboard/components/shortcut/CustomerProfileSh";
import Expense from "../pages/dashboard/components/shortcut/Expense";
import PurchaseListDetails from "../pages/purchase/components/purchase/PurchaseListDetails";
import VendorProfile from "../pages/purchase/components/vendor/VendorProfile";
import VendorsList from "../pages/purchase/components/vendor/VendorsList";
import MonthlyReport from "../pages/reports/components/monthlyReport/MonthlyReport";
import MonthPageReport from "../pages/reports/components/monthlyReport/MonthPageReport";
import QuickReport from "../pages/reports/components/QuickReport";
import UserList from "../pages/setting/components/userList/UserList";

import Settings from "../pages/setting/Settings";
import AppInitializer from "./AppInitializer";
import { SWReport } from "../pages/reports/components/stock&waerhouse/StockReport";
import SalesReport from "../pages/reports/components/SalesReport";
import TransactionReport from "../pages/reports/components/TransactionReport";
import StockWarehouseReport from "../pages/reports/components/stock&waerhouse/StockWarehouseReport";
import BarcodeGenerator from "../pages/tools/components/barcodeGenarator/BarcodeGenarator";
import { ProtectedRoute } from "./ProtectedRoute";
import UnAuthorized from "../pages/Unauthorized";
import NotFound from "../pages/404";
import FinancialGraph from "../pages/reports/components/monthlyReport/FullYearGraph";
import GenralSettingsPage from "../pages/setting/components/generalSetting/GeneralSetting";
import UserProfilePage from "../pages/setting/components/userProfile/UserProfile";
import { UserProfilePageContainer } from "../pages/setting/components/userProfile/UserProfilePageContainer";

function AppRouterProvider() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <PrivateRoute>
          <AppInitializer>
            <AppLayout />
          </AppInitializer>
        </PrivateRoute>
      ),
      errorElement: <h1 className="text-red-500">Page Not Found</h1>,
      children: [
        {
          element: <ProtectedRoute permission={["sales", "inventory"]} />,
          children: [
            {
              path: "/",
              element: <Dashboard />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="product_details" />,
          children: [
            {
              path: "/dashboard/product-details/:productId",
              element: <ProductDetails />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="expense" />,
          children: [
            {
              path: "/dashboard/expense",
              element: <Expense />,
            },
          ],
        },

        {
          element: <ProtectedRoute permission="customers" />,
          children: [
            {
              path: "/dashboard/customer",
              element: <CustomerProfileSh />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="sales" />,
          children: [
            {
              path: "/sale-payment",
              element: <SalePayment />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="purchases" />,
          children: [
            {
              path: "/dashboard/add-purchase",
              element: <AddPurchase />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="sales" />,
          children: [
            {
              path: "/sales",
              element: <Sales />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="purchases" />,
          children: [
            {
              path: "/purchase",
              element: <Purchase />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="finance" />,
          children: [
            {
              path: "/finance",
              element: <Finance />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="customers" />,
          children: [
            {
              path: "/customers",
              element: <Customers />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="customers" />,
          children: [
            {
              path: "/customers/:id",
              element: <CustomerProfile />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="customers" />,
          children: [
            {
              path: "/customers/:id/statement",
              element: <CustomerStatement />,
            },
          ],
        },

        {
          element: <ProtectedRoute permission="purchases" />,
          children: [
            {
              path: "/purchase/vendors",
              element: <VendorsList />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="purchases" />,
          children: [
            {
              path: "/purchase/vendors/:id",
              element: <VendorProfile />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="purchases" />,
          children: [
            {
              path: "/purchase/purchaseList",
              element: <PurchaseList />,
            },
          ],
        },

        {
          element: <ProtectedRoute permission="purchases" />,
          children: [
            {
              path: "/purchase/purchaseList/purchaseListDetails/:id",
              element: <PurchaseListDetails />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="finance" />,
          children: [
            {
              path: "/finance/members",
              element: <Members />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="finance" />,
          children: [
            {
              path: "/finance/monthlyPayments",
              element: <MonthlyPayments />,
            },
          ],
        },

        {
          element: <ProtectedRoute permission="finance" />,
          children: [
            {
              path: "/finance/paymentsReceive",
              element: <PaymentsReceive />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="finance" />,
          children: [
            {
              path: "/finance/resources",
              element: <Resources />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="finance" />,
          children: [
            {
              path: "/finance/employees",
              element: <Employees />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="stock_and_warehouse" />,
          children: [
            {
              path: "/stockAndWarehouse",
              element: <StockAndWarehouse />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="reports" />,
          children: [
            {
              path: "/reports",
              element: <Reports />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="reports" />,
          children: [
            {
              path: "/reports/quickReport",
              element: <QuickReport />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="reports" />,
          children: [
            {
              path: "/reports/monthlyReport",
              element: <MonthlyReport />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="reports" />,
          children: [
            {
              path: "/reports/:month-year",
              element: <MonthPageReport />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="reports" />,
          children: [
            {
              path: "/reports/StockWarehouseReport/:location_id",
              element: <SWReport />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="reports" />,
          children: [
            {
              path: "/reports/monthlyReport/:year",
              element: <FinancialGraph />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="reports" />,
          children: [
            {
              path: "/reports/monthlyReport/:year/:month",
              element: <MonthPageReport />,
            },
          ],
        },

        {
          element: <ProtectedRoute permission="reports" />,
          children: [
            {
              path: "/reports/salesReport",
              element: <SalesReport />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="customers" />,
          children: [
            {
              path: "/reports/customerReport",
              element: <CustomerReport />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="reports" />,
          children: [
            {
              path: "/reports/transactionReport",
              element: <TransactionReport />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="stock_and_warehouse" />,
          children: [
            {
              path: "/reports/StockWarehouseReport",
              element: <StockWarehouseReport />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="currency" />,
          children: [
            {
              path: "/reports/UserCashFlow",
              element: <UserCashFlow />,
            },
          ],
        },

        {
          path: "/tools",
          element: <Tools />,
        },
        {
          element: <ProtectedRoute permission="units" />,
          children: [
            {
              path: "/tools/units",
              element: <Units />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="currency" />,
          children: [
            {
              path: "/tools/currency",
              element: <MyCurrency />,
            },
          ],
        },
        {
          path: "/tools/barcodeGenerator",
          element: <BarcodeGenerator />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },

        {
          path: "/settings/general-settings",
          element: <GenralSettingsPage />,
        },

        {
          path: "/settings/profile",
          element: <UserProfilePage />,
        },
        {
          element: <ProtectedRoute permission="users" />,
          children: [
            {
              path: "/settings/users",
              element: <UserList />,
            },
          ],
        },
        {
          element: <ProtectedRoute permission="users" />,
          children: [
            {
              path: "/settings/users/:userId/profile",
              element: <UserProfilePageContainer />,
            },
          ],
        },

        {
          path: "/unauthorized",
          element: <UnAuthorized />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    // Add a catch-all route that redirects to login for unauthenticated users
    {
      path: "*",
      element: (
        <PrivateRoute>
          <NotFound />
        </PrivateRoute>
      ),
    },
  ]);

  return (
    // <AuthProvider>
    <RouterProvider router={router} />
    // </AuthProvider>
  );
}

export default AppRouterProvider;
