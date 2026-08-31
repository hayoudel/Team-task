import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Sidebar } from "./Sidebar";

export function AdminLayout() {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
