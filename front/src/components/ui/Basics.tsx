import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { ProjectStatus, TaskStatus, UserRole } from "../../types";
import { avatarColor, initials, projectStatusLabel, roleLabel, taskStatusLabel } from "../../utils/helpers";

/* ---------------- Button ---------------- */
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-500/20",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
  ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-500/20",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2 gap-2",
  lg: "text-sm px-5 py-2.5 gap-2",
};

export function Button({ variant = "primary", size = "md", icon, className = "", children, ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

/* ---------------- Avatar ---------------- */
type AvatarSize = "xs" | "sm" | "md" | "lg";
const avatarSizes: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-xl",
};

export function Avatar({
  id,
  firstName,
  lastName,
  size = "md",
  ring = false,
}: {
  id: string;
  firstName: string;
  lastName: string;
  size?: AvatarSize;
  ring?: boolean;
}) {
  return (
    <div
      className={`shrink-0 rounded-full flex items-center justify-center font-semibold text-white ${avatarColor(
        id
      )} ${avatarSizes[size]} ${ring ? "ring-2 ring-white" : ""}`}
      title={`${firstName} ${lastName}`}
    >
      {initials(firstName, lastName)}
    </div>
  );
}

/* ---------------- Card ---------------- */
export function Card({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-slate-100 ${
        onClick ? "cursor-pointer hover:shadow-lg transition-shadow duration-200" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------------- PageHeader ---------------- */
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

/* ---------------- StatCard ---------------- */
export function StatCard({
  icon,
  value,
  label,
  sub,
  color = "orange",
}: {
  icon: ReactNode;
  value: string | number;
  label: string;
  sub?: string;
  color?: "orange" | "blue" | "slate" | "amber" | "emerald" | "red";
}) {
  const colorMap: Record<string, string> = {
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
    slate: "bg-slate-100 text-slate-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>{icon}</div>
      </div>
      <div className="text-2xl font-black text-slate-900">{value}</div>
      <div className="text-sm text-slate-500 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </Card>
  );
}

/* ---------------- Badges ---------------- */
export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, string> = {
    todo: "bg-slate-100 text-slate-600",
    in_progress: "bg-amber-100 text-amber-700",
    done: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${map[status]}`}>
      {taskStatusLabel(status)}
    </span>
  );
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const map: Record<ProjectStatus, string> = {
    active: "bg-blue-100 text-blue-700",
    on_hold: "bg-amber-100 text-amber-700",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${map[status]}`}>
      {projectStatusLabel(status)}
    </span>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  const map: Record<UserRole, string> = {
    admin: "bg-red-100 text-red-700",
    chef_projet: "bg-orange-100 text-orange-700",
    user: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${map[role]}`}>
      {roleLabel(role)}
    </span>
  );
}

/* ---------------- ProgressBar ---------------- */
export function ProgressBar({
  value,
  size = "md",
  showLabel = false,
  colorClass = "bg-gradient-to-r from-orange-400 to-orange-500",
}: {
  value: number;
  size?: "sm" | "md";
  showLabel?: boolean;
  colorClass?: string;
}) {
  const h = size === "sm" ? "h-1.5" : "h-2.5";
  return (
    <div className="flex items-center gap-2 w-full">
      <div className={`flex-1 bg-slate-100 rounded-full overflow-hidden ${h}`}>
        <div className={`${h} rounded-full ${colorClass} transition-all duration-500`} style={{ width: `${value}%` }} />
      </div>
      {showLabel && <span className="text-xs font-semibold text-slate-600 w-9 text-right">{value}%</span>}
    </div>
  );
}
