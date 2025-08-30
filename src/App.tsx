import { ConfirmDialog } from "primereact/confirmdialog";
import AppRouterProvider from "./providers/AppRouterProvider";
import { QueryProvider } from "./providers/QueryProvider";
import { ToastProvider } from "./providers/ToastProvider";

function App() {
  
  return (
    <QueryProvider>
      <AppRouterProvider />
      <ToastProvider />
      <ConfirmDialog />
    </QueryProvider>
  );
}

export default App;
