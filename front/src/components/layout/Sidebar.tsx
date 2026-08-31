import {
  ChevronRight,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Shuffle,
  Tags,
  UserCircle,
  Users,
  FolderKanban,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Avatar } from "../ui/Basics";
import { roleLabel } from "../../utils/helpers";

const principalItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Utilisateurs", icon: Users },
  { to: "/admin/projects", label: "Projets", icon: FolderKanban },
  { to: "/admin/tasks", label: "Tâches", icon: ListTodo },
];

const gestionItems = [
  { to: "/admin/assignments", label: "Affectations", icon: Shuffle },
  { to: "/admin/roles", label: "Rôles", icon: Tags },
];

function NavSection({
  label,
  items,
  badgeCount,
}: {
  label: string;
  items: { to: string; label: string; icon: typeof LayoutDashboard }[];
  badgeCount?: number;
}) {
  return (
    <div>
      <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{label}</p>
      <div className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </span>
                <span className="flex items-center gap-1.5">
                  {item.label === "Tâches" && badgeCount ? (
                    <span
                      className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center ${
                        isActive ? "bg-white/25 text-white" : "bg-orange-500 text-white"
                      }`}
                    >
                      {badgeCount}
                    </span>
                  ) : null}
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export function Sidebar() {
  const { currentUser, logout, tasks } = useApp();
  const navigate = useNavigate();
  const todoCount = tasks.filter((t) => t.status === "todo").length;

  if (!currentUser) return null;

  return (
    <aside className="w-64 shrink-0 bg-slate-900 flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-orange-500/20">
          TT
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">Team Task</p>
          <p className="text-slate-500 text-xs leading-tight">Administration</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-6 overflow-y-auto pb-4">
        <NavSection label="Principal" items={principalItems} badgeCount={todoCount} />
        <NavSection label="Gestion" items={gestionItems} />
        <NavSection label="Compte" items={[{ to: "/admin/profile", label: "Profil", icon: UserCircle }]} />
      </nav>

      <div className="px-3 py-4 border-t border-slate-800">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
          <Avatar id={currentUser.id} firstName={currentUser.firstName} lastName={currentUser.lastName} size="sm" />
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <p className="text-slate-500 text-xs truncate">{roleLabel(currentUser.role)}</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
