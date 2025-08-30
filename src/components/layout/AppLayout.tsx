import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";

function AppLayout() {
  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-base text-base-front">
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default AppLayout;
