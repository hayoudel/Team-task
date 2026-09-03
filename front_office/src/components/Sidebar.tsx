import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderKanban, CheckSquare, User, LogOut } from "lucide-react";
import Avatar from "./ui/Avatar";
import { useAppContext } from "../context/AppContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Mes projets", icon: FolderKanban },
  { to: "/profile", label: "Mon profil", icon: User },
];

export default function Sidebar() {
  const { user, logout } = useAppContext();
  const fullName = user ? `${user.prenom} ${user.nom}` : "";

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-orange-100 flex flex-col">
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-orange-500 text-white font-black flex items-center justify-center text-sm">
            TT
          </div>
          <span className="font-black text-slate-900 text-lg">Team Task</span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-2 ${
                isActive
                  ? "bg-orange-50 text-orange-600 border-orange-500"
                  : "text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-700"
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-5 border-t border-orange-100">
        {user && (
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={fullName} size="sm" />
            <p className="text-sm font-semibold text-slate-900 truncate">{fullName}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:text-red-500 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}