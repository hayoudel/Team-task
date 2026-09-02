import { Role } from "../types/project";

interface RoleSwitcherProps {
  role: Role;
  onChange: (role: Role) => void;
}

export default function RoleSwitcher({ role, onChange }: RoleSwitcherProps) {
  return (
    <div className="flex items-center justify-end gap-2 px-8 py-2.5 bg-white border-b border-orange-100">
      <span className="text-xs text-slate-400 mr-1">Démo —</span>
      <div className="inline-flex items-center rounded-full bg-slate-100 p-1">
        <button
          onClick={() => onChange("chef")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            role === "chef" ? "bg-orange-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Vue Chef de projet
        </button>
        <button
          onClick={() => onChange("user")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            role === "user" ? "bg-blue-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Vue Utilisateur
        </button>
      </div>
    </div>
  );
}
